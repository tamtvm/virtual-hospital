from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer, PatientRecordSerializer

class PatientViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows patients to be viewed or edited.
    """
    # Only return patients that are active.
    # Brings the patients records but shows only the newest.
    queryset = Patient.objects.filter(is_active=True).order_by('-created_at').prefetch_related('records')
    serializer_class = PatientSerializer

    def perform_destroy(self, instance):
        """
        Soft delete: marks the patient as inactive.
        """
        instance.is_active = False
        instance.save()

    @action(detail=True, methods=['get'])
    def records(self, request, pk=None):
        """
        Full record history for a patient, newest first.
        """
        patient = self.get_object()
        serializer = PatientRecordSerializer(patient.records.all(), many=True)
        return Response(serializer.data)