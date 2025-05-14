# Create your views here.
from ninja import NinjaAPI
import vertexai
import glob
from vertexai.generative_models import GenerativeModel, Image
import os

api = NinjaAPI()


@api.get("/hello")
def hello(request):
    PROJECT_ID = os.environ.get("GCP_PROJECT_ID")
    vertexai.init(project=PROJECT_ID, location="asia-northeast1")

    model = GenerativeModel("gemini-1.5-flash-002")

    # FIXME: URLから画像を取得する必要あり。
    image_files = glob.glob("images/*.jpg")

    for image_file in image_files:
        response = model.generate_content(
            [
                "ブロック崩しをしています。今の状況にあったプレイヤーへの応援メッセージを作成してください。",
                Image.load_from_file(
                    image_file,
                ),
            ]
        )

    # FIXME: エラー処理必要
    return response.text
