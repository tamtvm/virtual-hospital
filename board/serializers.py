from rest_framework import serializers
from .models import BoardStroke

STROKE_MAX_POINTS = 2000


def is_unit_coordinate(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and 0 <= value <= 1


class BoardStrokeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardStroke
        fields = ['id', 'tool', 'points', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_points(self, value):
        if not isinstance(value, list) or not 1 <= len(value) <= STROKE_MAX_POINTS:
            raise serializers.ValidationError(
                f'points must hold between 1 and {STROKE_MAX_POINTS} pairs.'
            )
        for point in value:
            if not (isinstance(point, list) and len(point) == 2 and all(is_unit_coordinate(c) for c in point)):
                raise serializers.ValidationError(
                    'Each point must be an [x, y] pair in the 0-1 range.'
                )
        return value