from django.contrib import admin
from .models import DailyTokenUsage, RecordSummary


@admin.register(RecordSummary)
class RecordSummaryAdmin(admin.ModelAdmin):
    list_display = ('record', 'language', 'generated_by', 'generated_at')
    list_filter = ('language', 'generated_by')
    readonly_fields = ('generated_at',)


@admin.register(DailyTokenUsage)
class DailyTokenUsageAdmin(admin.ModelAdmin):
    list_display = ('day', 'tokens')
