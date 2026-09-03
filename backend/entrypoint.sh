#!/bin/sh
set -e

if [ "${SKIP_SETUP}" = "true" ]; then
  exec "$@"
fi

echo "PostgreSQL kutilmoqda..."
until python -c "
import os, psycopg
conn = psycopg.connect(
    dbname=os.environ['DB_NAME'],
    user=os.environ['DB_USER'],
    password=os.environ['DB_PASSWORD'],
    host=os.environ.get('DB_HOST', 'db'),
    port=os.environ.get('DB_PORT', '5432'),
)
conn.close()
" 2>/dev/null; do
  sleep 0.5
done
echo "PostgreSQL tayyor"

echo "Migratsiyalar..."
python manage.py migrate --noinput
echo "Migratsiyalar OK"

if [ "${SKIP_SEED}" != "true" ]; then
  echo "Seed..."
  python manage.py seed_data || true
fi

if [ "${SKIP_COLLECTSTATIC}" != "true" ]; then
  python manage.py collectstatic --noinput
fi

echo "Server ishga tushmoqda..."
exec "$@"
