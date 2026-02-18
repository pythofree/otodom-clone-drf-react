from django.db import models
from django.contrib.auth.models import User


class TransactionType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class District(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class PropertyListing(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    transaction_type = models.ForeignKey(
        TransactionType,
        on_delete=models.CASCADE,
        null=True, blank=True
    )

    district = models.ForeignKey(
        District,
        on_delete=models.CASCADE,
        null=True, blank=True
    )

    surface = models.PositiveIntegerField(
        help_text='Powierzchnia w m²',
        null=True, blank=True
    )
    rooms = models.PositiveIntegerField(
        help_text='Liczba pokoi',
        null=True, blank=True
    )

    location = models.CharField(max_length=255)
    image = models.ImageField(upload_to='listing_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')

    def __str__(self):
        return self.title
