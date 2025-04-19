# Create your views here.
from django.views.generic import TemplateView


class GameView(TemplateView):
    template_name = "index.html"
