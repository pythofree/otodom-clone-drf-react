from django.contrib import admin
from .models import PropertyListing, TransactionType, District


@admin.register(PropertyListing)
class PropertyListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'district', 'transaction_type', 'surface', 'rooms', 'owner', 'created_at')
    list_filter = ('district', 'transaction_type')
    search_fields = ('title', 'description', 'location')
    autocomplete_fields = ('owner',)


@admin.register(TransactionType)
class TransactionTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('name',)
