from rest_framework import serializers
from .models import PropertyListing, TransactionType, District

class TransactionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionType
        fields = ['id', 'name']

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name']

class PropertyListingSerializer(serializers.ModelSerializer):
    transaction_type = TransactionTypeSerializer(read_only=True)
    transaction_type_id = serializers.PrimaryKeyRelatedField(
        queryset=TransactionType.objects.all(), write_only=True, source='transaction_type'
    )

    district = DistrictSerializer(read_only=True)
    district_id = serializers.PrimaryKeyRelatedField(
        queryset=District.objects.all(), write_only=True, source='district'
    )

    class Meta:
        model = PropertyListing
        fields = [
            'id', 'title', 'description', 'price',
            'transaction_type', 'transaction_type_id',
            'district', 'district_id',
            'surface', 'rooms', 'location', 'image',
            'created_at', 'owner'
        ]
        read_only_fields = ['id', 'created_at', 'owner']
