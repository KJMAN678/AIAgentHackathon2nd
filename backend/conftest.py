import pytest
import os
import django
from django.conf import settings
from django.test.utils import get_runner

def pytest_configure():
    settings.configure(
        DEBUG=True,
        DATABASES={
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': ':memory:'
            }
        },
        INSTALLED_APPS=[
            'django.contrib.admin',
            'django.contrib.auth',
            'django.contrib.contenttypes',
            'corsheaders',
            'api',
        ],
        SECRET_KEY='test-secret-key',
        USE_TZ=True,
        ROOT_URLCONF='config.urls',
        CORS_ALLOW_ALL_ORIGINS=True,
        CORS_ALLOWED_ORIGINS=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
        CORS_ALLOW_CREDENTIALS=True,
    )
    django.setup()

@pytest.fixture
def shared_images_dir(tmp_path):
    test_dir = tmp_path / "shared-images"
    test_dir.mkdir()
    return test_dir

@pytest.fixture
def sample_image_file(shared_images_dir):
    image_path = shared_images_dir / "sample.jpeg"
    image_path.write_bytes(b"fake_image_data")
    return image_path

@pytest.fixture
def canvas_image_file(shared_images_dir):
    image_path = shared_images_dir / "canvas.jpg"
    image_path.write_bytes(b"fake_canvas_data")
    return image_path
