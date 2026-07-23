from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet

# Create a router and register viewsets with it
router = DefaultRouter()
router.register(r'patients', PatientViewSet)

# API URLs are determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
]