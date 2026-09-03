.PHONY: up down logs migrate seed restart psql

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f api celery_worker celery_beat

migrate:
	docker compose exec api python manage.py migrate

seed:
	docker compose exec api python manage.py seed_data

restart:
	docker compose restart api celery_worker celery_beat

psql:
	docker compose exec db psql -U nsucombinator -d nsucombinator

shell:
	docker compose exec api python manage.py shell
