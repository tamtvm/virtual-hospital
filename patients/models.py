from django.db import models

class Patient(models.Model):
    """
    Basic patient model for MLVH
    Replaces standard clinical data with a playful, RPG style structure!
    """
    SPECIES_CHOICES = [
        ('human', 'Human'),
        ('cat', 'Cat'),
        ('bunny', 'Bunny'),
        ('rat', 'Rat'),
        ('monkey', 'Monkey'),
        ('other', 'Other'),
    ]

    SEX_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('unknown', 'Unknown'),
    ]

    LOCATION_CHOICES = [
        ('EA', 'Earth'),
        ('PL', 'Pluto'),
        ('ET', 'Ether'),
        ('NW', 'Nowhere'),
    ]

    # Core character stats
    name = models.CharField(max_length=20)
    age = models.PositiveIntegerField()
    species = models.CharField(max_length=20, choices=SPECIES_CHOICES, default='human')
    sex = models.CharField(max_length=20, choices=SEX_CHOICES, default='unknown')
    
    # Composite patient ID + location acting as the prefix (e.g.,'EA-99999')
    location = models.CharField(max_length=2, choices=LOCATION_CHOICES, default='EA')
    id_number = models.CharField(max_length=5, unique=True)

    avatar_style = models.CharField(max_length=50, blank=True)
    main_symptom = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.location}-{self.id_number}] {self.name} the {self.species.capitalize()}"