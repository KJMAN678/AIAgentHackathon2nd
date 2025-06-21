import vertexai
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from vertexai.generative_models import GenerativeModel, Image
import os
from pathlib import Path

api = NinjaAPI()

# Ensure the shared-images directory exists
SHARED_IMAGES_DIR = Path("/app/backend/shared-images")
SHARED_IMAGES_DIR.mkdir(parents=True, exist_ok=True)


@api.post("/save-canvas")
def save_canvas(request, image: UploadedFile = File(...)):
    # Save the uploaded canvas image
    canvas_path = SHARED_IMAGES_DIR / "canvas.jpg"
    with open(canvas_path, "wb") as f:
        f.write(image.read())
    return {"success": True}


@api.get("/hello")
def hello(request):
    PROJECT_ID = os.environ.get("GCP_PROJECT_ID")
    vertexai.init(project=PROJECT_ID, location="asia-northeast1")

    model = GenerativeModel("gemini-1.5-flash-002")

    # Use the saved canvas image if it exists, otherwise use the sample image
    canvas_path = SHARED_IMAGES_DIR / "canvas.jpg"
    sample_image_path = SHARED_IMAGES_DIR / "sample.jpeg"

    image_path = None
    if canvas_path.exists():
        image_path = canvas_path
    elif sample_image_path.exists():
        image_path = sample_image_path

    if image_path is None:
        return {"result": "No image file found."}

    response = model.generate_content(
        [
            "ブロック崩しのゲームをしています。この画像からブロック崩しのゲームの状況を判断し、応援してください",
            Image.load_from_file(str(image_path)),
        ]
    )

    # FIXME: エラー処理必要
    return {"result": response.text}


@api.delete("/delete-canvas")
def delete_canvas(request):
    canvas_path = SHARED_IMAGES_DIR / "canvas.jpg"
    if canvas_path.exists():
        canvas_path.unlink()
    return {"success": True}
