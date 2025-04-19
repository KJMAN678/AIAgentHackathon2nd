from django.urls import path
from .views import NumberGameView, ShootingGameView

urlpatterns = [
    path("number/", NumberGameView.as_view(), name="number"),
    path("shooting/", ShootingGameView.as_view(), name="shooting"),
]
