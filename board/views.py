from rest_framework import mixins, status, viewsets
from rest_framework.exceptions import APIException, ValidationError
from .models import BoardStroke
from .serializers import BoardStrokeSerializer

BOARD_MAX_STROKES = 5000


class BoardFull(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'The board is full!! wait till next sandbox reset.'
    default_code = 'board_full'


class BoardStrokeViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = BoardStroke.objects.all()
    serializer_class = BoardStrokeSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = super().get_queryset()
        after = self.request.query_params.get('after')
        if after is None:
            return queryset
        try:
            return queryset.filter(id__gt=int(after))
        except ValueError:
            raise ValidationError({'after': 'Must be an integer stroke id.'})

    def create(self, request, *args, **kwargs):
        if BoardStroke.objects.count() >= BOARD_MAX_STROKES:
            raise BoardFull()
        return super().create(request, *args, **kwargs)