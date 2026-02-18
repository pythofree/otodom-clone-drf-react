from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import PropertyListing


class PropertyListingTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.another_user = User.objects.create_user(username='otheruser', password='otherpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_user_registration(self):
        print("\n✅ Rejestracja nowego użytkownika")
        response = self.client.post('/api/register/', {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123'
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['message'], 'Użytkownik zarejestrował się pomyślnie')

    def test_listing_creation_success(self):
        print("\n✅ Tworzenie ogłoszenia jako zalogowany użytkownik")
        data = {
            'title': 'Test title',
            'description': 'Test description',
            'price': 999.99,
            'location': 'Warszawa'
        }
        response = self.client.post('/api/listings/', data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['title'], 'Test title')

    def test_listing_creation_without_authentication(self):
        print("\n❌ Tworzenie ogłoszenia bez autoryzacji")
        self.client.logout()
        data = {
            'title': 'Test title',
            'description': 'No auth',
            'price': 123,
            'location': 'Wrocław'
        }
        response = self.client.post('/api/listings/', data)
        self.assertEqual(response.status_code, 401)
        self.assertIn('detail', response.data)

    def test_listings_list(self):
        print("\n✅ Pobieranie listy wszystkich ogłoszeń")
        PropertyListing.objects.create(
            owner=self.user,
            title='Ogłoszenie A',
            description='Opis A',
            price=1000,
            location='Kraków'
        )
        response = self.client.get('/api/listings/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_my_listings_view(self):
        print("\n✅ Pobieranie ogłoszeń zalogowanego użytkownika")
        listing = PropertyListing.objects.create(
            owner=self.user,
            title='Moje ogłoszenie',
            description='Opis testowy',
            price=500,
            location='Gdańsk'
        )
        response = self.client.get('/api/my_listings/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['owner'], 'testuser')

    def test_delete_listing_by_owner(self):
        print("\n✅ Usuwanie ogłoszenia przez właściciela")
        listing = PropertyListing.objects.create(
            owner=self.user,
            title='To Delete',
            description='Delete desc',
            price=200,
            location='Kraków'
        )
        response = self.client.delete(f'/api/listings/{listing.id}/')
        self.assertEqual(response.status_code, 204)

    def test_delete_listing_by_non_owner(self):
        print("\n❌ Próba usunięcia ogłoszenia przez innego użytkownika")
        listing = PropertyListing.objects.create(
            owner=self.another_user,
            title='Should not delete',
            description='Nie twój listing',
            price=200,
            location='Poznań'
        )
        response = self.client.delete(f'/api/listings/{listing.id}/')
        self.assertEqual(response.status_code, 403)

    def test_exchange_rate_success(self):
        print("\n✅ Pobieranie kursu dolara z NBP API")
        response = self.client.get('/api/exchange-rate/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('rate', response.data)

    def test_create_listing_missing_fields(self):
        print("\n❌ Tworzenie ogłoszenia bez wymaganych pól")
        response = self.client.post('/api/listings/', {})
        self.assertEqual(response.status_code, 400)
        self.assertIn('title', response.data)
        self.assertIn('description', response.data)
