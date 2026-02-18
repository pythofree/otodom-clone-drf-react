from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from backend_api.views import (
    PropertyListingView,
    PropertyListingDetailView,
    RegisterView,
    MyListingsView,
    ExchangeRateView,
    FakePayUView,
TransactionTypeListView,
DistrictListView

)

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from django.views.generic import TemplateView

# Swagger schema
schema_view = get_schema_view(
    openapi.Info(
        title="Stancje API",
        default_version='v1',
        description="Dokumentacja API dla ogłoszeń nieruchomości",
        contact=openapi.Contact(email="twójemail@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    authentication_classes=[],
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/listings/', PropertyListingView.as_view(), name='property-list'),
    path('api/listings/<int:pk>/', PropertyListingDetailView.as_view(), name='property-detail'),
    path('api/my_listings/', MyListingsView.as_view(), name='my-property-list'),
    path('api/exchange-rate/', ExchangeRateView.as_view(), name='exchange-rate'),
    path('api/pay/', FakePayUView.as_view(), name='fake-payu'),
    path('api/transaction-types/', TransactionTypeListView.as_view()),
    path('api/districts/', DistrictListView.as_view()),

    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Swagger
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Media для DEBUG режима
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# 🔁 React fallback (в конце!)
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
