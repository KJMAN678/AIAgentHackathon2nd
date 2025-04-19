from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import TopView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("game/", include("game.urls")),
    path("", TopView.as_view(), name="top"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
