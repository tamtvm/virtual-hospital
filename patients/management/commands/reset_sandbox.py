from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import transaction

from board.models import BoardStroke
from patients.models import Patient


class Command(BaseCommand):
    """Wipe demo patient data and reload the sandbox seed fixture."""

    help = "Resets the sandbox database to its seed state"

    @transaction.atomic
    def handle(self, *args, **options):
        Patient.objects.all().delete()
        BoardStroke.objects.all().delete()
        call_command('loaddata', 'sandbox_seed')
        self.stdout.write(self.style.SUCCESS('Sandbox reset complete'))