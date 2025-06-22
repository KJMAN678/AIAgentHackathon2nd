import pytest
from unittest.mock import patch, MagicMock, mock_open
from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile
from pathlib import Path
import os

class TestAPIEndpoints(TestCase):
    def setUp(self):
        self.client = Client()

    @patch('api.api.SHARED_IMAGES_DIR')
    def test_save_canvas_success(self, mock_shared_dir, tmp_path):
        mock_shared_dir.__truediv__ = lambda self, other: tmp_path / other
        
        test_image = SimpleUploadedFile(
            "test_canvas.jpg",
            b"fake_image_content",
            content_type="image/jpeg"
        )
        
        response = self.client.post('/api/save-canvas', {'image': test_image})
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"success": True})

    def test_save_canvas_no_file(self):
        response = self.client.post('/api/save-canvas')
        self.assertEqual(response.status_code, 422)

    @patch.dict(os.environ, {'GCP_PROJECT_ID': 'test-project'})
    @patch('api.api.vertexai')
    @patch('api.api.GenerativeModel')
    @patch('api.api.Image')
    @patch('api.api.SHARED_IMAGES_DIR')
    def test_hello_with_canvas_image(self, mock_shared_dir, mock_image, mock_model_class, mock_vertexai, tmp_path):
        canvas_path = tmp_path / "canvas.jpg"
        canvas_path.write_bytes(b"fake_canvas_data")
        
        mock_shared_dir.__truediv__ = lambda self, other: tmp_path / other
        mock_shared_dir.exists = lambda: True
        
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.text = "ゲームが進行中です！"
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model
        
        mock_image.load_from_file.return_value = MagicMock()
        
        with patch.object(Path, 'exists') as mock_exists:
            mock_exists.side_effect = lambda: str(canvas_path) in str(mock_shared_dir.__truediv__(mock_shared_dir, "canvas.jpg"))
            
            response = self.client.get('/api/hello')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"result": "ゲームが進行中です！"})
        mock_vertexai.init.assert_called_once_with(project='test-project', location='asia-northeast1')

    @patch.dict(os.environ, {'GCP_PROJECT_ID': 'test-project'})
    @patch('api.api.vertexai')
    @patch('api.api.GenerativeModel')
    @patch('api.api.Image')
    @patch('api.api.SHARED_IMAGES_DIR')
    def test_hello_with_sample_image(self, mock_shared_dir, mock_image, mock_model_class, mock_vertexai, tmp_path):
        sample_path = tmp_path / "sample.jpeg"
        sample_path.write_bytes(b"fake_sample_data")
        
        mock_shared_dir.__truediv__ = lambda self, other: tmp_path / other
        
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.text = "サンプル画像での応援メッセージ"
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model
        
        mock_image.load_from_file.return_value = MagicMock()
        
        def mock_exists_side_effect():
            path_str = str(mock_shared_dir.__truediv__(mock_shared_dir, "canvas.jpg"))
            if "canvas.jpg" in path_str:
                return False
            elif "sample.jpeg" in path_str:
                return True
            return False
        
        with patch.object(Path, 'exists', side_effect=mock_exists_side_effect):
            response = self.client.get('/api/hello')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"result": "サンプル画像での応援メッセージ"})

    @patch('api.api.SHARED_IMAGES_DIR')
    def test_hello_no_image(self, mock_shared_dir, tmp_path):
        mock_shared_dir.__truediv__ = lambda self, other: tmp_path / other
        
        with patch.object(Path, 'exists', return_value=False):
            response = self.client.get('/api/hello')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"result": "No image file found."})

    @patch('api.api.SHARED_IMAGES_DIR')
    def test_delete_canvas_existing_file(self, mock_shared_dir, tmp_path):
        canvas_path = tmp_path / "canvas.jpg"
        canvas_path.write_bytes(b"fake_canvas_data")
        
        mock_shared_dir.__truediv__ = lambda self, other: canvas_path
        
        with patch.object(Path, 'exists', return_value=True), \
             patch.object(Path, 'unlink') as mock_unlink:
            response = self.client.delete('/api/delete-canvas')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"success": True})
        mock_unlink.assert_called_once()

    @patch('api.api.SHARED_IMAGES_DIR')
    def test_delete_canvas_no_file(self, mock_shared_dir, tmp_path):
        mock_shared_dir.__truediv__ = lambda self, other: tmp_path / other
        
        with patch.object(Path, 'exists', return_value=False):
            response = self.client.delete('/api/delete-canvas')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"success": True})
