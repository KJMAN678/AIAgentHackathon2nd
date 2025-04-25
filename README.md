```sh
# Python の環境構築
$ uv python pin 3.11
$ uv venv .venv
$ source .venv/bin/activate
$ uv pip install -U pip
$ uv pip install -r requirements.txt

# migrate 実行
$ python manage.py migrate

# スーパーユーザー作成
$ python manage.py createsuperuser --noinput
$ rm -rf staticfiles/
$ python manage.py collectstatic --no-input

# ローカルサーバー立ち上げ
$ gunicorn --bind 0.0.0.0:8080 config.wsgi:application

http://0.0.0.0:8080/game/game/
http://0.0.0.0:8080/admin/

# 実行する必要ないが参考: Django のプロジェクト作成
$ django-admin startproject config .

# 実行済みだが migration ファイルの作成
$ python manage.py makemigrations

$ mkdir game
$ django-admin startapp game game
```

### GCP
- HOGE_PROJECT_ID、HOGE_PROJECT_NUMBER は適宜更新
```sh
# 環境変数の設定.
$ export PROJECT_ID=HOGE_PROJECT_ID
$ export PROJECT_NUMBER=HOGE_PROJECT_NUMBER

# GC CLI でログイン 
$ gcloud auth login

# プロジェクトIDの設定
$ gcloud config set project $PROJECT_ID

# Cloud Run Admin API と Cloud Build API を有効にする
$ gcloud services enable run.googleapis.com \
    cloudbuild.googleapis.com

# Cloud Build サービス アカウントに次の IAM ロールを付与
$ gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member=serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
      --role=roles/run.builder
  
# CloudRun にデプロイ
# Port は 8080 にする必要あり
$ gcloud run deploy --source . gen-ai-game --region asia-northeast2 --allow-unauthenticated
```

### ruff によるコード整形
```sh
$ ruff check . --fix
$ ruff format .
```

### 参考サイト
- [GCP 公式ドキュメント Flask アプリをCloudRunにデプロイ](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service?hl=ja)
- [GCP 公式ドキュメント 公開（未認証）アクセスを許可する --allow-unauthenticated](https://cloud.google.com/run/docs/authenticating/public?hl=ja)
- [GCP 公式ドキュメント Vertex AI の生成 AI のロケーション](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/locations?hl=ja)
- [GCP 公式ドキュメント DjangoアプリをCloudRunにデプロイ](https://cloud.google.com/python/django/run)
  - [サンプルコード](https://github.com/GoogleCloudPlatform/python-docs-samples/tree/main/run/django)
- JavaScript によるゲームの実装
  - [番号タッチゲームを作るよ](https://javascript-game.com/number-touch-game/)
