import pytest
from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch, MagicMock
import os
from pathlib import Path

@pytest.mark.django_db
class TestAPIIntegration(TestCase):
    
    def setUp(self):
        self.client = Client()

    def test_api_workflow_complete(self):
        with patch('api.api.SHARED_IMAGES_DIR') as mock_shared_dir, \
             patch.dict(os.environ, {'GCP_PROJECT_ID': 'test-project'}), \
             patch('api.api.vertexai') as mock_vertexai, \
             patch('api.api.GenerativeModel') as mock_model_class, \
             patch('api.api.Image') as mock_image, \
             patch.object(Path, 'exists') as mock_exists, \
             patch.object(Path, 'unlink') as mock_unlink:
            
            mock_shared_dir.__truediv__ = lambda self, other: Path(f"/tmp/{other}")
            
            test_image = SimpleUploadedFile(
                "test_canvas.jpg",
                b"fake_image_content",
                content_type="image/jpeg"
            )
            
            save_response = self.client.post('/api/save-canvas', {'image': test_image})
            self.assertEqual(save_response.status_code, 200)
            self.assertEqual(save_response.json(), {"success": True})
            
            mock_model = MagicMock()
            mock_response = MagicMock()
            mock_response.text = "統合テスト応援メッセージ"
            mock_model.generate_content.return_value = mock_response
            mock_model_class.return_value = mock_model
            mock_image.load_from_file.return_value = MagicMock()
            mock_exists.return_value = True
            
            hello_response = self.client.get('/api/hello')
            self.assertEqual(hello_response.status_code, 200)
            self.assertEqual(hello_response.json(), {"result": "統合テスト応援メッセージ"})
            
            delete_response = self.client.delete('/api/delete-canvas')
            self.assertEqual(delete_response.status_code, 200)
            self.assertEqual(delete_response.json(), {"success": True})

    @patch('api.api.vertexai')
    @patch('api.api.GenerativeModel')
    def test_error_handling_no_gcp_project(self, mock_model_class, mock_vertexai):
        mock_vertexai.init.side_effect = Exception("No GCP project configured")
        
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaises(Exception):
                response = self.client.get('/api/hello')

    @patch('api.api.vertexai')
    @patch('api.api.GenerativeModel')
    @patch('api.api.Image')
    def test_cors_headers_present(self, mock_image, mock_model_class, mock_vertexai):
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.text = "テスト応援メッセージ"
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model
        mock_image.load_from_file.return_value = MagicMock()
        
        with patch.dict(os.environ, {'GCP_PROJECT_ID': 'test-project'}), \
             patch.object(Path, 'exists', return_value=True):
            response = self.client.get('/api/hello')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"result": "テスト応援メッセージ"})
