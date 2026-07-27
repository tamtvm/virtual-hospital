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
        ('unknown', 'Unknown'),
    ]

    SEX_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('unknown', 'Unknown'),
    ]

    PRONOUN_CHOICES = [
        ('she/her', 'She/Her'),
        ('he/him', 'He/Him'),
        ('they/them', 'They/Them'),
    ]

    LOCATION_CHOICES = [
        ('EA', 'Earth'),
        ('PL', 'Pluto'),
        ('ET', 'Ether'),
        ('NW', 'Nowhere'),
        ('XX', 'Unknown'),
    ]

    # Core character stats
    name = models.CharField(max_length=20)
    age = models.PositiveIntegerField()
    species = models.CharField(max_length=20, choices=SPECIES_CHOICES, default='human')
    sex = models.CharField(max_length=20, choices=SEX_CHOICES, default='unknown')
    pronouns = models.CharField(max_length=20, choices=PRONOUN_CHOICES, default='they/them')

    # Composite patient ID + location acting as the prefix (e.g.,'EA-99999')
    location = models.CharField(max_length=2, choices=LOCATION_CHOICES, default='EA')
    id_number = models.CharField(max_length=5)

    avatar_style = models.CharField(max_length=50, blank=True)
    main_symptom = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Flag for soft-delete
    is_active = models.BooleanField(default=True)

    class Meta:
        # id_number is only meaningful scoped to its location
        # (e.g. 'EA-2222' and 'PL-2222' r different patients)
        constraints = [
            models.UniqueConstraint(
                fields=['location', 'id_number'],
                condition=models.Q(is_active=True),
                name='unique_active_patient_id_per_location',
            )
        ]

    def __str__(self):
        return f"[{self.location}-{self.id_number}] {self.name} the {self.species.capitalize()}"

    def save(self, *args, **kwargs):
        """
        Auto-generate the avatar style based on the selected species and sex.
        Enforces the "unknown" character as a single, indivisible unit:
        sex, species, location and pronouns only ever move to their unknown
        value together. :D
        """
        if self.sex == 'unknown' or self.species == 'unknown' or self.location == 'XX':
            self.sex = 'unknown'
            self.species = 'unknown'
            self.location = 'XX'
            self.pronouns = 'they/them'

        self.avatar_style = f"{self.species}_{self.sex}"
        super().save(*args, **kwargs)