from django.db import models
from django.db.models.functions import Length
from django.db.models.lookups import LessThanOrEqual

from patients.models import PatientRecord

SUMMARY_MAX_LENGTH = 1200


class RecordSummary(models.Model):
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('es', 'Spanish'),
    ]

    record = models.ForeignKey(PatientRecord, on_delete=models.CASCADE, related_name='summaries')
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES)
    text = models.TextField(max_length=SUMMARY_MAX_LENGTH)
    generated_by = models.CharField(max_length=100)
    generated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['record', 'language'], name='unique_summary_per_record_language'),
            models.CheckConstraint(
                condition=LessThanOrEqual(Length('text'), SUMMARY_MAX_LENGTH),
                name='summary_text_max_length',
            ),
        ]

    def __str__(self):
        return f"{self.get_language_display()} summary — {self.record}"


class DailyTokenUsage(models.Model):
    day = models.DateField(unique=True)
    tokens = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.day}: {self.tokens} tokens"
