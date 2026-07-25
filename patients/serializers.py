import re

from rest_framework import serializers
from .models import Patient

ID_NUMBER_PATTERN = re.compile(r'^[A-Za-z0-9]{1,5}$')


class PatientSerializer(serializers.ModelSerializer):
    """
    Serializer for the patient model,
    converts python model instances into JSON for the frontend API.
    """
    avatar_style = serializers.CharField(read_only=True)

    class Meta:
        model = Patient
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        for validator in self.validators:
            if (
                isinstance(validator, serializers.UniqueTogetherValidator)
                and set(validator.fields) == {'location', 'id_number'}
            ):
                validator.message = (
                    'A patient with this ID already exists at this location'
                )

    def validate_id_number(self, value):
        """
        The frontend already restricts this to 1-5 alphanumeric characters
        but im double enforcing same rule here so it doesnt get bypassed 
        by any direct API call.
        
        """
        if not ID_NUMBER_PATTERN.fullmatch(value):
            raise serializers.ValidationError(
                'ID number must be 1-5 alphanumeric characters.'
            )
        return value.upper()