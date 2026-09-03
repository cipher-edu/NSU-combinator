FROM python:3.12-slim

ARG ENVIRONMENT=development

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    ENVIRONMENT=${ENVIRONMENT} \
    DJANGO_SETTINGS_MODULE=config.settings.${ENVIRONMENT}

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements/ requirements/
RUN pip install -r requirements/base.txt && \
    if [ "$ENVIRONMENT" = "production" ]; then pip install -r requirements/production.txt; \
    else pip install -r requirements/development.txt; fi

COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh /app/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--threads", "2", "--timeout", "60"]
