from django.db import IntegrityError, transaction
from django.test import TestCase
from rest_framework.serializers import ValidationError
from rest_framework.test import APITestCase

from .models import Patient
from .serializers import PatientSerializer

# --- Fixtures ---

PATIENT_PAYLOAD = {
    'name': 'Momo',
    'age': 3,
    'species': 'cat',
    'sex': 'female',
    'pronouns': 'she/her',
    'location': 'EA',
    'id_number': 'a12',
    'consultation_type': 'scheduled',
    'assigned_professional': 'dr_milo',
    'description': 'Admitted for a checkup.',
    'record_date': '2026-09-09',
}

def build_patient(**overrides):
    fields = {
        'name': 'Momo',
        'age': 3,
        'species': 'cat',
        'sex': 'female',
        'pronouns': 'she/her',
        'location': 'EA',
        'id_number': 'A12',
    }
    fields.update(overrides)
    return Patient.objects.create(**fields)

# --- Model behaviour ---

class PatientModelTests(TestCase):

    def test_avatar_style_is_derived_from_species_and_sex(self):
        self.assertEqual(build_patient().avatar_style, 'cat_female')

    def test_unknown_species_collapses_the_whole_identity(self):
        patient = build_patient(species='unknown')
        self.assertEqual(patient.sex, 'unknown')
        self.assertEqual(patient.location, 'XX')
        self.assertEqual(patient.pronouns, 'they/them')
        self.assertEqual(patient.avatar_style, 'unknown_unknown')

    def test_unknown_location_collapses_the_whole_identity(self):
        patient = build_patient(location='XX')
        self.assertEqual(patient.species, 'unknown')
        self.assertEqual(patient.sex, 'unknown')

    def test_same_id_number_is_allowed_in_a_different_location(self):
        build_patient(location='EA', id_number='777')
        build_patient(location='PL', id_number='777')
        self.assertEqual(Patient.objects.count(), 2)

    def test_discharging_a_patient_frees_its_id_number(self):
        discharged = build_patient(id_number='777')
        discharged.is_active = False
        discharged.save()

        build_patient(id_number='777')
        self.assertEqual(Patient.objects.filter(id_number='777').count(), 2)

    def test_active_id_number_cannot_repeat_in_the_same_location(self):
        build_patient(id_number='777')
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                build_patient(id_number='777')

# --- ID number validation ---

class IdNumberValidationTests(TestCase):

    def setUp(self):
        self.serializer = PatientSerializer()

    def test_id_number_is_normalised_to_uppercase(self):
        self.assertEqual(self.serializer.validate_id_number('a1b'), 'A1B')

    def test_id_number_rejects_more_than_five_characters(self):
        with self.assertRaises(ValidationError):
            self.serializer.validate_id_number('ABC123')

    def test_id_number_rejects_symbols(self):
        with self.assertRaises(ValidationError):
            self.serializer.validate_id_number('A-1')

    def test_id_number_rejects_an_empty_value(self):
        with self.assertRaises(ValidationError):
            self.serializer.validate_id_number('')

# --- Admission endpoint ---

class PatientAdmissionApiTests(APITestCase):

    url = '/api/patients/'

    def test_admitting_a_patient_creates_its_first_record(self):
        response = self.client.post(self.url, PATIENT_PAYLOAD, format='json')

        self.assertEqual(response.status_code, 201)
        patient = Patient.objects.get(id_number='A12')
        self.assertEqual(patient.records.count(), 1)

    def test_admission_rejects_an_invalid_id_number(self):
        response = self.client.post(
            self.url, {**PATIENT_PAYLOAD, 'id_number': 'TOOLONG'}, format='json'
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('id_number', response.data)

    def test_admission_rejects_a_duplicate_id_at_the_same_location(self):
        self.client.post(self.url, PATIENT_PAYLOAD, format='json')
        response = self.client.post(self.url, PATIENT_PAYLOAD, format='json')

        self.assertEqual(response.status_code, 400)