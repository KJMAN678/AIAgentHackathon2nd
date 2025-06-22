import pytest
from unittest.mock import patch, MagicMock, mock_open
from pathlib import Path
import os
from api.api import save_canvas, hello, delete_canvas
from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import HttpRequest

class TestAPIUnits:
    
    @patch('api.api.SHARED_IMAGES_DIR')
    def test_save_canvas_unit(self, mock_shared_dir, tmp_path):
        mock_shared_dir.__truediv__ = lambda self, other: tmp_path / "canvas.jpg"
        
        request = HttpRequest()
        test_file = SimpleUploadedFile("test.jpg", b"test_content", content_type="image/jpeg")
        
        with patch("builtins.open", mock_open()) as mock_file:
            result = save_canvas(request, test_file)
        
        assert result == {"success": True}
        mock_file.assert_called_once()

    @patch.dict(os.environ, {'GCP_PROJECT_ID': 'test-project'})
    @patch('api.api.vertexai')
    @patch('api.api.GenerativeModel')
    @patch('api.api.Image')
    @patch('api.api.SHARED_IMAGES_DIR')
    def test_hello_unit_with_canvas(self, mock_shared_dir, mock_image, mock_model_class, mock_vertexai, tmp_path):
        canvas_path = tmp_path / "canvas.jpg"
        sample_path = tmp_path / "sample.jpeg"
        
        mock_shared_dir.__truediv__ = lambda self, name: canvas_path if name == "canvas.jpg" else sample_path
        
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.text = "テスト応援メッセージ"
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model
        
        mock_image.load_from_file.return_value = MagicMock()
        
        request = HttpRequest()
        
        with patch.object(Path, 'exists') as mock_exists:
            mock_exists.side_effect = lambda: True if "canvas.jpg" in str(canvas_path) else False
            result = hello(request)
        
        assert result == {"result": "テスト応援メッセージ"}
        mock_vertexai.init.assert_called_once_with(project='test-project', location='asia-northeast1')
        mock_model.generate_content.assert_called_once()

    @patch('api.api.SHARED_IMAGES_DIR')
    @patch('api.api.vertexai')
    @patch('api.api.GenerativeModel')
    def test_hello_unit_no_image(self, mock_model_class, mock_vertexai, mock_shared_dir, tmp_path):
        mock_shared_dir.__truediv__ = lambda self, other: tmp_path / other
        
        request = HttpRequest()
        
        with patch.object(Path, 'exists', return_value=False):
            result = hello(request)
            
        assert result == {"result": "No image file found."}

    @patch('api.api.SHARED_IMAGES_DIR')
    def test_delete_canvas_unit(self, mock_shared_dir, tmp_path):
        canvas_path = tmp_path / "canvas.jpg"
        mock_shared_dir.__truediv__ = lambda self, other: canvas_path
        
        request = HttpRequest()
        
        with patch.object(Path, 'exists', return_value=True), \
             patch.object(Path, 'unlink') as mock_unlink:
            result = delete_canvas(request)
        
        assert result == {"success": True}
        mock_unlink.assert_called_once()

    @patch('api.api.SHARED_IMAGES_DIR')
    def test_delete_canvas_unit_no_file(self, mock_shared_dir, tmp_path):
        canvas_path = tmp_path / "canvas.jpg"
        mock_shared_dir.__truediv__ = lambda self, other: canvas_path
        
        request = HttpRequest()
        
        with patch.object(Path, 'exists', return_value=False):
            result = delete_canvas(request)
        
        assert result == {"success": True}
