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
$ export GCP_EMAIL=HOGE_GCP_EMAIL

# GC CLI でログイン 
$ gcloud auth login

# プロジェクトIDの設定
$ gcloud config set project $PROJECT_ID

# Cloud Run Admin API と Cloud Build API, ArtifactRegistry API を有効にする
$ gcloud services enable run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com

# Cloud Build サービス アカウントに次の IAM ロールを付与
$ gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member=serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
      --role=roles/run.builder
  
# CloudRun にデプロイ
# Port は 8080 にする必要あり
$ gcloud run deploy --source . gen-ai-game --region asia-northeast2 --allow-unauthenticated
```

### Docker 導入検証
```sh
$ docker build -t django-app --no-cache .
$ docker run -p 8080:8080 django-app
```

### CloudRun + Dockerfile デプロイ 検証
```sh
- Artifact-Repository にリポジトリ作成する
export REPOSITORY-IMAGE-NAME=asia-northeast1-docker.pkg.dev/green-campaign-457913-e2/ai-agent-hackathon/ai-game
export REPOSITORY-NAME=asia-northeast1-docker.pkg.dev

$ gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="user:${GCP_EMAIL}" \
  --role=roles/artifactregistry.writer

- リポジトリにロールを付与
$ gcloud artifacts repositories add-iam-policy-binding ai-agent-hackathon \
   --location=asia-northeast1 \
   --member="user:${GCP_EMAIL}" \
   --role=roles/artifactregistry.writer

- Docker の認証
$ gcloud auth configure-docker asia-northeast1-docker.pkg.dev

# イメージをビルド
# Artifact Registry では REPOSITORY という階層が増え、asia-docker.pkg.dev/${REGISTRY_IMAGE_PROJECT}/${REPOSITORY_NAME}/${IMAGE_NAME} とする必要あり
# https://qiita.com/yan_yan/items/1f157f4bae5a6b32cdf0#%E8%A9%B0%E3%81%BE%E3%81%A3%E3%81%9F%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88%EF%BC%91
$ docker build . --tag asia-northeast1-docker.pkg.dev/green-campaign-457913-e2/ai-agent-hackathon/ai-game --platform linux/amd64

# イメージをプッシュ
$ docker push asia-northeast1-docker.pkg.dev/green-campaign-457913-e2/ai-agent-hackathon/ai-game

# デプロイ
$ gcloud run deploy gen-ai-game --image asia-northeast1-docker.pkg.dev/green-campaign-457913-e2/ai-agent-hackathon/ai-game --region asia-northeast2 --allow-unauthenticated
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

- [ソースをコンテナにビルドする](https://cloud.google.com/run/docs/building/containers?hl=ja#docker)
- [Docker + Cloud Run へのコンテナ イメージのデプロイ](https://cloud.google.com/run/docs/deploying?hl=ja#service)
- [Artifact Registry ロールの付与](https://cloud.google.com/artifact-registry/docs/access-control?hl=ja#grant-project)
- [事前定義された Artifact Registry ロール](https://cloud.google.com/artifact-registry/docs/access-control?hl=ja#roles)
- [Artifact RegistryのイメージをGKEにデプロイする際に詰まった話](https://qiita.com/yan_yan/items/1f157f4bae5a6b32cdf0)
  - Artifact Registry では REPOSITORY という階層が増え、asia-docker.pkg.dev/${REGISTRY_IMAGE_PROJECT}/${REPOSITORY_NAME}/${IMAGE_NAME} とする必要あり
- 
