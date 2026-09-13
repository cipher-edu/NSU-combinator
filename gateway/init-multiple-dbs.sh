#!/bin/bash
set -e

function create_user_and_database() {
    local database=$1
    echo "  PostgreSQL ma'lumotlar bazasi tekshirilmoqda/yaratilmoqda: '$database'"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        SELECT 'CREATE DATABASE $database'
        WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$database')\gexec
        GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
    echo "Ko'p bazali initsializatsiya boshlandi: $POSTGRES_MULTIPLE_DATABASES"
    for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
        create_user_and_database $db
    done
    echo "Barcha mikroservis ma'lumotlar bazalari muvaffaqiyatli yaratildi!"
fi
