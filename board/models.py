from django.db import models


class BoardStroke(models.Model):
    TOOL_CHOICES = [
        ('pen', 'Pen'),
        ('eraser', 'Eraser'),
    ]

    tool = models.CharField(max_length=10, choices=TOOL_CHOICES, default='pen')
    points = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.get_tool_display()} stroke #{self.pk} ({len(self.points)} points)"