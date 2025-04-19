```sh
$ uv python pin 3.11
$ uv venv .venv
$ source .venv/bin/activate
$ uv pip install -U pip
$ uv pip install -r requirements.txt
$ django-admin startproject config .

# ローカルサーバー立ち上げ
$ gunicorn --bind 0.0.0.0:8080 config.wsgi:application

http://0.0.0.0:8080/game/game/
http://0.0.0.0:8080/admin/

$ python manage.py migrate
$ python manage.py makemigrations
$ python manage.py createsuperuser --noinput
$ rm -rf staticfiles/
$ python manage.py collectstatic --clear

$ mkdir game
$ django-admin startapp game game
```

```sh
$ export PROJECT_ID=
$ export PROJECT_NUMBER=
$ gcloud auth login
$ gcloud config set project $PROJECT_ID
$ gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member=serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
      --role=roles/run.builder
  
# CloudRun にデプロイ
# Port は 8080 にする必要あり
$ gcloud run deploy --source . cloud-run-source-deploy --region asia-northeast2 --allow-unauthenticated

https://cloud-run-source-deploy-937624703345.asia-northeast2.run.app/game/game/
```

### ruff によるコード整形
```sh
$ ruff check . --fix
$ ruff format .
```
docker compose up -d
docker compose up --build
docker container exec -it aiagenthackathon2nd-web-1 bash

https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service?hl=ja
https://cloud.google.com/run/docs/authenticating/public?hl=ja
https://cloud.google.com/run/docs/configuring/services/containers?hl=ja
https://cloud.google.com/python/django/run
https://github.com/GoogleCloudPlatform/python-docs-samples/tree/main/run/django
