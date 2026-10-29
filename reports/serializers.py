from rest_framework import serializers
from .models import RecordSummary

TURNSTILE_TOKEN_MAX_LENGTH = 2048


class RecordSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = RecordSummary
        fields = ['record', 'language', 'text', 'generated_by', 'generated_at']


class SummaryRequestSerializer(serializers.Serializer):
    language = serializers.ChoiceField(choices=RecordSummary.LANGUAGE_CHOICES)
    turnstile_token = serializers.CharField(max_length=TURNSTILE_TOKEN_MAX_LENGTH)
