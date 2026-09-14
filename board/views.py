from rest_framework import mixins, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .models import BoardStroke
from .serializers import BoardStrokeSerializer

BOARD_MAX_STROKES = 5000


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
            return Response(
                {'detail': 'The board is full!! wait till next sandbox reset.'},
                status=status.HTTP_409_CONFLICT,
            )
        return super().create(request, *args, **kwargs)