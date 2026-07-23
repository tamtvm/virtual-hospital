from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    """
    Serializer for the patient model,
    converts python model instances into JSON for the frontend API.
    """
    avatar_style = serializers.CharField(read_only=True)

    class Meta:
        model = Patient
        fields = '__all__'