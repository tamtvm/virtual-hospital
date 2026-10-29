from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from patients.models import PatientRecord
from .serializers import RecordSummarySerializer, SummaryRequestSerializer
from .summaries import ensure_ai_configured, existing_summary, generate_summary
from .turnstile import require_human


def get_active_record(record_id):
    return get_object_or_404(PatientRecord, pk=record_id, patient__is_active=True)


class RecordSummaryCreateView(APIView):

    def post(self, request, record_id):
        record = get_active_record(record_id)
        serializer = SummaryRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        language = serializer.validated_data['language']

        summary = existing_summary(record, language)
        if summary:
            return Response(RecordSummarySerializer(summary).data)

        ensure_ai_configured()
        require_human(serializer.validated_data['turnstile_token'])
        summary, created = generate_summary(record, language)
        return Response(
            RecordSummarySerializer(summary).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class RecordSummaryDetailView(APIView):

    def get(self, request, record_id, language):
        summary = existing_summary(get_active_record(record_id), language)
        if summary is None:
            raise NotFound('This record has no summary in that language yet.', code='summary_not_found')
        return Response(RecordSummarySerializer(summary).data)
