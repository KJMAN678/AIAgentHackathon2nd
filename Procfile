# Django 実行
web: gunicorn --bind 0.0.0.0:8080 config.wsgi:application

# migrate 実行
migrate: python manage.py migrate

# パスワード設定
set_password: export DJANGO_SUPERUSER_PASSWORD=test1234

create_user: python manage.py createsuperuser --username admin --email test@test.com --noinput

# static ファイルの収集
delete_staticfiles: rm -rf staticfiles/
collect_static: python manage.py collectstatic --noinput
