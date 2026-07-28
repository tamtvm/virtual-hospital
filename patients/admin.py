from django.contrib import admin
from .models import Patient, PatientRecord

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    # Admin list view
    list_display = ('name', 'species', 'location', 'id_number', 'created_at')
    
    # Search bar
    search_fields = ('name', 'id_number')
    
    # Filters
    list_filter = ('species', 'location', 'sex')

    # Auto-generated fields read-only in admin panel
    readonly_fields = ('avatar_style',)


@admin.register(PatientRecord)
class PatientRecordAdmin(admin.ModelAdmin):
    list_display = ('patient', 'record_type', 'consultation_type', 'created_at')
    list_filter = ('record_type', 'consultation_type')
    readonly_fields = ('created_at',)