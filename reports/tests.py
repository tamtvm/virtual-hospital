import json
from io import StringIO
from unittest.mock import patch
from urllib.parse import parse_qs

import httpx
from django.core.management import CommandError, call_command
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from patients.models import Patient, PatientRecord
from .ai import ChatCompletionClient
from .labels import LABELS
from .models import DailyTokenUsage, RecordSummary
from .summaries import MAX_COMPLETION_TOKENS, REASONING_EFFORT, TOKEN_RESERVATION, build_messages
from .turnstile import SITEVERIFY_URL, TurnstileUnavailable, verify_token

# --- Fixtures ---

AI_SETTINGS = {
    'AI_BASE_URL': 'https://ai.test/v1',
    'AI_MODEL': 'test/model',
    'AI_API_KEY': 'test-key',
    'AI_DAILY_TOKEN_BUDGET': 10000,
    'TURNSTILE_SECRET_KEY': 'test-secret',
    'TURNSTILE_ALLOWED_HOSTNAMES': ['virtual-hospital.pages.dev'],
}

SUMMARY_TEXT = 'Momo came in for a routine checkup and left in good spirits.'


def build_record(pronouns='she/her', **overrides):
    patient = Patient.objects.create(
        name='Momo', age=3, species='cat', sex='female', pronouns=pronouns, location='EA', id_number='A12'
    )
    fields = {
        'patient': patient,
        'record_type': 'consultation',
        'consultation_type': 'preventive',
        'assigned_professional': 'rn_tam',
        'description': 'Routine follow-up.',
    }
    fields.update(overrides)
    return PatientRecord.objects.create(**fields)


def completion(content=SUMMARY_TEXT, finish_reason='stop', total_tokens=900):
    return httpx.Response(200, json={
        'choices': [{'message': {'role': 'assistant', 'content': content}, 'finish_reason': finish_reason}],
        'usage': {'prompt_tokens': 600, 'completion_tokens': total_tokens - 600, 'total_tokens': total_tokens},
    })


class FakeProvider:

    def __init__(self, *responses):
        self.responses = list(responses)
        self.requests = []

    def __call__(self, request):
        self.requests.append(request)
        return self.responses.pop(0)

    def client(self):
        return ChatCompletionClient(
            AI_SETTINGS['AI_BASE_URL'],
            AI_SETTINGS['AI_API_KEY'],
            AI_SETTINGS['AI_MODEL'],
            transport=httpx.MockTransport(self),
        )


def tokens_used_today():
    usage = DailyTokenUsage.objects.filter(day=timezone.now().date()).first()
    return usage.tokens if usage else 0

# --- Summary retrieval ---

class SummaryRetrievalApiTests(APITestCase):

    def setUp(self):
        self.record = build_record()

    def test_missing_summary_reports_the_summary_not_found_code(self):
        response = self.client.get(f'/api/reports/records/{self.record.id}/summaries/es/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail']['code'], 'summary_not_found')

    def test_existing_summary_is_returned(self):
        RecordSummary.objects.create(record=self.record, language='es', text=SUMMARY_TEXT, generated_by='test/model')
        response = self.client.get(f'/api/reports/records/{self.record.id}/summaries/es/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['text'], SUMMARY_TEXT)
        self.assertEqual(response.data['generated_by'], 'test/model')

    def test_records_of_discharged_patients_are_hidden(self):
        self.record.patient.is_active = False
        self.record.patient.save()
        response = self.client.get(f'/api/reports/records/{self.record.id}/summaries/es/')
        self.assertEqual(response.data['detail']['code'], 'not_found')

# --- Summary generation ---

@override_settings(**AI_SETTINGS)
class SummaryGenerationApiTests(APITestCase):

    def setUp(self):
        self.record = build_record()
        self.url = f'/api/reports/records/{self.record.id}/summaries/'
        self.payload = {'language': 'es', 'turnstile_token': 'token'}
        self.provider = FakeProvider(completion())
        self.verify = self.patch('reports.turnstile.verify_token', return_value=True)
        self.patch('reports.summaries.summary_client', side_effect=self.provider.client)

    def patch(self, target, **options):
        patcher = patch(target, **options)
        self.addCleanup(patcher.stop)
        return patcher.start()

    def test_generation_stores_the_summary_and_its_model(self):
        response = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['text'], SUMMARY_TEXT)
        summary = RecordSummary.objects.get(record=self.record, language='es')
        self.assertEqual(summary.generated_by, 'test/model')

    def test_generation_sends_the_record_to_the_configured_model(self):
        self.client.post(self.url, self.payload, format='json')
        request = self.provider.requests[0]
        body = json.loads(request.content)
        self.assertEqual(str(request.url), 'https://ai.test/v1/chat/completions')
        self.assertEqual(request.headers['Authorization'], 'Bearer test-key')
        self.assertEqual(body['model'], 'test/model')
        self.assertEqual(body['reasoning_effort'], REASONING_EFFORT)
        self.assertEqual(body['max_completion_tokens'], MAX_COMPLETION_TOKENS)
        self.assertIn('Routine follow-up.', body['messages'][1]['content'])

    def test_generation_records_the_tokens_actually_used(self):
        self.client.post(self.url, self.payload, format='json')
        self.assertEqual(tokens_used_today(), 900)

    def test_existing_summary_skips_the_human_check_and_the_provider(self):
        RecordSummary.objects.create(record=self.record, language='es', text=SUMMARY_TEXT, generated_by='test/model')
        response = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.verify.assert_not_called()
        self.assertEqual(self.provider.requests, [])

    def test_failed_human_check_is_rejected_before_any_spending(self):
        self.verify.return_value = False
        response = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(response.data['detail']['code'], 'turnstile_failed')
        self.assertEqual(self.provider.requests, [])
        self.assertEqual(tokens_used_today(), 0)

    def test_unreachable_turnstile_reports_unavailable(self):
        self.verify.side_effect = TurnstileUnavailable('ConnectError')
        response = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertEqual(response.data['detail']['code'], 'summary_unavailable')

    @override_settings(AI_API_KEY=None)
    def test_missing_ai_key_reports_unavailable_without_a_human_check(self):
        response = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(response.data['detail']['code'], 'summary_unavailable')
        self.verify.assert_not_called()

    @override_settings(TURNSTILE_SECRET_KEY=None)
    def test_missing_turnstile_secret_reports_unavailable(self):
        response = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(response.data['detail']['code'], 'summary_unavailable')
        self.assertEqual(self.provider.requests, [])

    def test_exhausted_budget_is_rejected_without_calling_the_provider(self):
        DailyTokenUsage.objects.create(
            day=timezone.now().date(), tokens=AI_SETTINGS['AI_DAILY_TOKEN_BUDGET'] - TOKEN_RESERVATION + 1
        )
        response = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        self.assertEqual(response.data['detail']['code'], 'summary_budget_exhausted')
        self.assertEqual(self.provider.requests, [])

    def test_provider_errors_release_the_reservation(self):
        self.provider.responses = [httpx.Response(500)]
        with self.assertLogs('reports.summaries', level='WARNING'):
            response = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(response.data['detail']['code'], 'summary_unavailable')
        self.assertEqual(tokens_used_today(), 0)

    def test_truncated_output_is_rejected_but_its_tokens_are_counted(self):
        self.provider.responses = [completion(finish_reason='length', total_tokens=1600)]
        with self.assertLogs('reports.summaries', level='WARNING'):
            response = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(response.data['detail']['code'], 'summary_unavailable')
        self.assertFalse(RecordSummary.objects.exists())
        self.assertEqual(tokens_used_today(), 1600)

    def test_blank_output_is_rejected(self):
        self.provider.responses = [completion(content='   ')]
        with self.assertLogs('reports.summaries', level='WARNING'):
            response = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(response.data['detail']['code'], 'summary_unavailable')

    def test_output_whitespace_is_collapsed_into_one_paragraph(self):
        self.provider.responses = [completion(content='  Momo is well.\n\nShe can go home.  ')]
        response = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(response.data['text'], 'Momo is well. She can go home.')

    def test_output_hyphens_and_spaces_are_normalized(self):
        self.provider.responses = [completion(content='Momo,\u202fa 2\u2011year\u2011old cat,\u00a0is well.')]
        response = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(response.data['text'], 'Momo, a 2-year-old cat, is well.')

    def test_unsupported_language_is_rejected(self):
        response = self.client.post(self.url, {**self.payload, 'language': 'fr'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['language'][0]['code'], 'invalid_choice')

    def test_missing_turnstile_token_is_rejected(self):
        response = self.client.post(self.url, {'language': 'es'}, format='json')
        self.assertEqual(response.data['turnstile_token'][0]['code'], 'required')

# --- Prompt ---

class PromptTests(TestCase):

    def test_spanish_prompt_uses_the_spanish_pronoun_mapping(self):
        record = build_record(pronouns='they/them')
        instructions = build_messages(record, 'es')[0]['content']
        self.assertIn('Spanish', instructions)
        self.assertIn('"él"', instructions)

    def test_record_details_leave_out_empty_fields(self):
        record = build_record(diagnosis='Sneezes', procedures='')
        details = json.loads(build_messages(record, 'en')[1]['content'])
        self.assertEqual(details['consultation']['diagnosis'], 'Sneezes')
        self.assertNotIn('procedures', details['consultation'])

    def test_record_details_carry_only_the_visit_in_the_report_language(self):
        record = build_record(diagnosis='Sneezes')
        details = json.loads(build_messages(record, 'es')[1]['content'])
        self.assertEqual(details, {
            'patient': {'name': 'Momo'},
            'consultation': {
                'type': 'Consulta',
                'category': 'Preventiva',
                'diagnosis': 'Sneezes',
                'description': 'Routine follow-up.',
            },
        })

# --- Labels ---

class LabelCatalogTests(TestCase):

    def test_every_language_has_a_label_for_every_choice(self):
        choices = {
            'pronouns': Patient.PRONOUN_CHOICES,
            'record_types': PatientRecord.RECORD_TYPE_CHOICES,
            'consultation_types': PatientRecord.CONSULTATION_TYPE_CHOICES,
        }
        self.assertEqual(set(LABELS), {code for code, _ in RecordSummary.LANGUAGE_CHOICES})
        for language, groups in LABELS.items():
            for group, group_choices in choices.items():
                with self.subTest(language=language, group=group):
                    self.assertEqual(set(groups[group]), {value for value, _ in group_choices})

# --- Turnstile ---

class TurnstileVerificationTests(TestCase):

    def verify(self, *responses, allowed=('virtual-hospital.pages.dev',)):
        self.requests = []
        pending = list(responses)

        def handler(request):
            self.requests.append(request)
            outcome = pending.pop(0)
            if isinstance(outcome, Exception):
                raise outcome
            return httpx.Response(200, json=outcome)

        return verify_token('token', secret='secret', allowed_hostnames=allowed, transport=httpx.MockTransport(handler))

    def test_valid_token_from_the_site_passes(self):
        self.assertTrue(self.verify({'success': True, 'hostname': 'virtual-hospital.pages.dev'}))
        form = parse_qs(self.requests[0].content.decode())
        self.assertEqual(str(self.requests[0].url), SITEVERIFY_URL)
        self.assertEqual(form['secret'], ['secret'])
        self.assertEqual(form['response'], ['token'])

    def test_preview_deployments_pass(self):
        self.assertTrue(self.verify({'success': True, 'hostname': 'abc123.virtual-hospital.pages.dev'}))

    def test_tokens_from_other_hostnames_fail(self):
        self.assertFalse(self.verify({'success': True, 'hostname': 'evil-virtual-hospital.pages.dev'}))

    def test_unsuccessful_verification_fails(self):
        self.assertFalse(self.verify({'success': False, 'error-codes': ['invalid-input-response']}))

    def test_transport_errors_are_retried_once_with_the_same_idempotency_key(self):
        error = httpx.ConnectError('boom')
        self.assertTrue(self.verify(error, {'success': True, 'hostname': 'virtual-hospital.pages.dev'}))
        keys = [parse_qs(request.content.decode())['idempotency_key'] for request in self.requests]
        self.assertEqual(len(keys), 2)
        self.assertEqual(keys[0], keys[1])

    def test_persistent_transport_errors_raise_unavailable(self):
        with self.assertRaises(TurnstileUnavailable):
            self.verify(httpx.ConnectError('boom'), httpx.ConnectError('boom'))

# --- Management command ---

@override_settings(**AI_SETTINGS)
class SummarizeRecordCommandTests(TestCase):

    def setUp(self):
        self.record = build_record()
        self.provider = FakeProvider(completion(content='Fresh summary.'))
        patcher = patch('reports.summaries.summary_client', side_effect=self.provider.client)
        self.addCleanup(patcher.stop)
        patcher.start()

    def test_command_generates_and_prints_the_summary(self):
        output = StringIO()
        call_command('summarize_record', self.record.id, language='es', stdout=output)
        self.assertEqual(output.getvalue().strip(), 'Fresh summary.')
        self.assertTrue(RecordSummary.objects.filter(record=self.record, language='es').exists())

    def test_command_refuses_to_overwrite_without_replace(self):
        RecordSummary.objects.create(record=self.record, language='es', text=SUMMARY_TEXT, generated_by='test/model')
        with self.assertRaises(CommandError):
            call_command('summarize_record', self.record.id, language='es')
        self.assertEqual(self.provider.requests, [])

    def test_replace_regenerates_the_existing_summary(self):
        RecordSummary.objects.create(record=self.record, language='es', text=SUMMARY_TEXT, generated_by='old/model')
        call_command('summarize_record', self.record.id, language='es', replace=True, stdout=StringIO())
        summary = RecordSummary.objects.get(record=self.record, language='es')
        self.assertEqual(summary.text, 'Fresh summary.')
        self.assertEqual(summary.generated_by, 'test/model')

# --- Sandbox reset ---

class SandboxResetTests(TestCase):

    def test_reset_removes_summaries_but_keeps_token_usage(self):
        record = build_record()
        RecordSummary.objects.create(record=record, language='en', text=SUMMARY_TEXT, generated_by='test/model')
        DailyTokenUsage.objects.create(day=timezone.now().date(), tokens=1234)
        call_command('reset_sandbox', stdout=StringIO())
        self.assertFalse(RecordSummary.objects.exists())
        self.assertEqual(tokens_used_today(), 1234)
