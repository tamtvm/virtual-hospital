from rest_framework import viewsets
from .models import Patient
from .serializers import PatientSerializer

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