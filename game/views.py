# Create your views here.
from django.views.generic import TemplateView


class GameView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # ゲームデータをここに追加
        context["game_data"] = {
            "level": 5,
        }
        return context
