from django.urls import path
from . import views

urlpatterns = [
    path('admissions-weekly/', views.admissions_weekly, name='analytics-admissions-weekly'),
    path('patients-by-species/', views.patients_by_species, name='analytics-patients-by-species'),
    path('consultations-by-reason/', views.consultations_by_reason, name='analytics-consultations-by-reason'),
]