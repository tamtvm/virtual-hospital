from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BoardStrokeViewSet

router = DefaultRouter()
router.register(r'strokes', BoardStrokeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]