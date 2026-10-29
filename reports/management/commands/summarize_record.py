from django.core.management.base import BaseCommand, CommandError
from rest_framework.exceptions import APIException

from patients.models import PatientRecord
from reports.models import RecordSummary
from reports.summaries import existing_summary, generate_summary


class Command(BaseCommand):
    help = 'Generates the AI summary of a record in one language'

    def add_arguments(self, parser):
        parser.add_argument('record_id', type=int)
        parser.add_argument(
            '--language',
            choices=[code for code, _ in RecordSummary.LANGUAGE_CHOICES],
            default='en',
        )
        parser.add_argument('--replace', action='store_true')

    def handle(self, *args, record_id, language, replace, **options):
        try:
            record = PatientRecord.objects.select_related('patient').get(pk=record_id)
        except PatientRecord.DoesNotExist as error:
            raise CommandError(f'Record {record_id} does not exist.') from error

        if not replace and existing_summary(record, language):
            raise CommandError('This record already has a summary in that language. Use --replace to regenerate it.')

        try:
            summary, _ = generate_summary(record, language, replace=replace)
        except APIException as error:
            raise CommandError(str(error.detail)) from error
        self.stdout.write(summary.text)
