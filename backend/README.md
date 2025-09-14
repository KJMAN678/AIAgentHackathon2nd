## 以下、Computer Engine 導入により使っていない. 備忘として残す

### Docker 導入検証
```sh
# キャッシュ削除
$ docker builder prune -f

# Docker コンテナ ビルド
$ docker build -t django-app --no-cache .

# Docker コンテナ立ち上げ
$ docker run -p 8080:8080 django-app
```

http://0.0.0.0:8080/api/add?a=1&b=2
http://0.0.0.0:8080/admin/

### Django コマンド(Dockerに導入未了)
```sh
# スーパーユーザー作成
$ docker compose run --rm backend python manage.py createsuperuser --noinput
$ rm -rf staticfiles/
$ docker compose run --rm backend python manage.py collectstatic --no-input

# 実行する必要ないが参考: Django のプロジェクト作成
$ docker compose run --rm backend django-admin startproject config .

# docker compose run backend python manage.py migrate

# 実行済みだが migration ファイルの作成
$ docker compose run --rm backend python manage.py makemigrations

# app 追加. settings.py の INSTALLED_APP にも追加をわすれないこと.
$ mkdir backend/api
$ docker compose run --rm backend django-admin startapp api backend/api
```

### GCP
- HOGE_PROJECT_ID、HOGE_PROJECT_NUMBER、HOGE_GCP_EMAIL は適宜更新
```sh
# 環境変数の設定.
$ export PROJECT_ID=HOGE_PROJECT_ID
$ export PROJECT_NUMBER=HOGE_PROJECT_NUMBER
$ export GCP_EMAIL=HOGE_GCP_EMAIL
$ export LOCATION=asia
$ export REGION=${LOCATION}-northeast1
$ export FORMAT=docker

# 東京リージョン Artifact Repository 用の環境変数
$ export DOMAIN_NAME=${REGION}-${FORMAT}.pkg.dev
$ export REPOSITORY_NAME=ai-agent-hackathon
$ export DOCKER_IMAGE_NAME=ai-game

# Artifact Repository は asia-docker.pkg.dev/${REGISTRY_IMAGE_PROJECT}/${REPOSITORY_NAME}/${IMAGE_NAME} とする必要あり
$ export REPOSITORY_IMAGE_NAME=${DOMAIN_NAME}/${PROJECT_ID}/${REPOSITORY_NAME}/${DOCKER_IMAGE_NAME}

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
  
# Artifact-Repository にリポジトリ作成する
$ gcloud artifacts repositories create ${REPOSITORY_NAME} --location=${REGION} --repository-format=docker

# Docker の認証
$ gcloud auth configure-docker $REPOSITORY_NAME

# ユーザーに Artifact Registry のロールを付与
$ gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="user:${GCP_EMAIL}" \
  --role=roles/artifactregistry.writer

# リポジトリに Artifact Registry のロールを付与
$ gcloud artifacts repositories add-iam-policy-binding $REPOSITORY_NAME \
   --location=${REGION} \
   --member="user:${GCP_EMAIL}" \
   --role=roles/artifactregistry.writer \
   --project=${PROJECT_ID}

# イメージをビルド
# Artifact Registry では REPOSITORY という階層が増え、
# asia-docker.pkg.dev/${REGISTRY_IMAGE_PROJECT}/${REPOSITORY_NAME}/${IMAGE_NAME} とする必要あり
# Silicon Mac を使っているため、プラットフォーム指定必要
$ docker build --no-cache . --tag $REPOSITORY_IMAGE_NAME --platform linux/amd64

# イメージをプッシュ
$ docker push $REPOSITORY_IMAGE_NAME

# デプロイ
$ gcloud run deploy gen-ai-game --image $REPOSITORY_IMAGE_NAME --region ${REGION} --allow-unauthenticated
```

### ruff によるコード整形
```sh
$ docker compose run --rm backend ruff check . --fix
$ docker compose run --rm backend ruff format .

### uv.lock の更新
$ docker compose run --rm backend uv sync
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
- [gcloud アーティファクト リポジトリ 作成](https://cloud.google.com/sdk/gcloud/reference/artifacts/repositories/create)
- [Django Ninja](https://django-ninja.dev/)
