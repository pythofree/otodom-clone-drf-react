from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated

from datetime import datetime
import uuid
import requests

from .models import PropertyListing, TransactionType, District
from .serializer import PropertyListingSerializer, TransactionTypeSerializer, DistrictSerializer

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class PropertyListingView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        listings = PropertyListing.objects.all()

        location = request.GET.get('location')
        price_min = request.GET.get('price_min')
        price_max = request.GET.get('price_max')
        transaction_type_id = request.GET.get('transaction_type_id')
        district_id = request.GET.get('district_id')
        surface_min = request.GET.get('surface_min')
        surface_max = request.GET.get('surface_max')
        rooms = request.GET.get('rooms')

        if location:
            listings = listings.filter(location__icontains=location)
        if price_min:
            listings = listings.filter(price__gte=price_min)
        if price_max:
            listings = listings.filter(price__lte=price_max)
        if transaction_type_id:
            listings = listings.filter(transaction_type_id=transaction_type_id)
        if district_id:
            listings = listings.filter(district_id=district_id)
        if surface_min:
            listings = listings.filter(surface__gte=surface_min)
        if surface_max:
            listings = listings.filter(surface__lte=surface_max)
        if rooms:
            listings = listings.filter(rooms=rooms)

        listings = listings.order_by('-created_at')
        serializer = PropertyListingSerializer(listings, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['title', 'description', 'price', 'location'],
            properties={
                'title': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING),
                'price': openapi.Schema(type=openapi.TYPE_NUMBER, format='float'),
                'location': openapi.Schema(type=openapi.TYPE_STRING),
                'image': openapi.Schema(type=openapi.TYPE_STRING, format='binary'),
            }
        )
    )
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "Aby dodać ogłoszenie musisz się zalogować"}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = PropertyListingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyListingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        listings = PropertyListing.objects.filter(owner=request.user).order_by('-created_at')
        serializer = PropertyListingSerializer(listings, many=True)
        return Response(serializer.data)

class PropertyListingDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self, pk):
        try:
            return PropertyListing.objects.get(pk=pk)
        except PropertyListing.DoesNotExist:
            return None

    def get(self, request, pk):
        listing = self.get_object(pk)
        if not listing:
            return Response({'error': f'Reklama z id {pk} nie została znaleziona'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PropertyListingSerializer(listing)
        return Response(serializer.data)

    def delete(self, request, pk):
        listing = self.get_object(pk)
        if not listing:
            return Response({'error': f'Reklama z id {pk} nie została znaleziona'}, status=status.HTTP_404_NOT_FOUND)

        if listing.owner != request.user:
            return Response({'error': 'Brak dostępu do usunięcia tej reklamy'}, status=status.HTTP_403_FORBIDDEN)

        listing.delete()
        return Response({'message': 'Reklama została pomyślnie usunięta'}, status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['title', 'description', 'price', 'location'],
            properties={
                'title': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING),
                'price': openapi.Schema(type=openapi.TYPE_NUMBER, format='float'),
                'location': openapi.Schema(type=openapi.TYPE_STRING),
                'image': openapi.Schema(type=openapi.TYPE_STRING, format='binary'),
            }
        )
    )
    def put(self, request, pk):
        listing = self.get_object(pk)
        if not listing:
            return Response({'error': f'Reklama z id {pk} nie została znaleziona'}, status=status.HTTP_404_NOT_FOUND)

        if listing.owner != request.user:
            return Response({'error': 'Nie masz uprawnień do edycji tego ogłoszenia.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = PropertyListingSerializer(listing, data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['username', 'email', 'password'],
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING, format='email'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, format='password'),
            }
        )
    )
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({'error': 'Wszystkie pola są wymagane'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Użytkownik o tej nazwie już istnieje'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({'message': 'Użytkownik zarejestrował się pomyślnie'}, status=status.HTTP_201_CREATED)

class ExchangeRateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        url = 'https://api.nbp.pl/api/exchangerates/rates/A/USD/?format=json'
        try:
            r = requests.get(url, timeout=5)
            data = r.json()
            rate = data['rates'][0]['mid']
            return Response({'rate': rate})
        except Exception:
            return Response({'error': 'Błąd pobierania kursu z NBP'}, status=500)

class FakePayUView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'title': openapi.Schema(type=openapi.TYPE_STRING),
                'amount': openapi.Schema(type=openapi.TYPE_INTEGER, description='Amount in grosze'),
                'currency': openapi.Schema(type=openapi.TYPE_STRING, default='PLN')
            }
        )
    )
    def post(self, request):
        title = request.data.get("title", "Produkt testowy")
        amount = request.data.get("amount", 1000)
        currency = request.data.get("currency", "PLN")

        return Response({
            "status": "SUCCESS",
            "message": "Płatność rozpoczęta",
            "redirectUri": "http://localhost:3000/payment-success",
            "orderId": str(uuid.uuid4()),
            "order": {
                "title": title,
                "amount": amount,
                "currency": currency,
                "created_at": datetime.now().isoformat()
            }
        })

class TransactionTypeListView(ListAPIView):
    queryset = TransactionType.objects.all()
    serializer_class = TransactionTypeSerializer
    permission_classes = [AllowAny]

class DistrictListView(ListAPIView):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [AllowAny]
