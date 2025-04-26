FROM python:3.11-slim-bookworm

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Sync the project into a new environment, using the frozen lockfile
COPY . /app
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Run migrations
RUN python manage.py migrate

# Expose port
EXPOSE 8080

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "config.wsgi:application"]
