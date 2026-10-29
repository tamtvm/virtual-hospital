from django.urls import path
from .views import RecordSummaryCreateView, RecordSummaryDetailView

urlpatterns = [
    path('records/<int:record_id>/summaries/', RecordSummaryCreateView.as_view(), name='record-summary-create'),
    path(
        'records/<int:record_id>/summaries/<str:language>/',
        RecordSummaryDetailView.as_view(),
        name='record-summary-detail',
    ),
]
