-- PostgreSQL multiple databases initialization for NavDU UZ Combinator
SELECT 'CREATE DATABASE apps_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'apps_db')\gexec
SELECT 'CREATE DATABASE startups_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'startups_db')\gexec
SELECT 'CREATE DATABASE events_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'events_db')\gexec

GRANT ALL PRIVILEGES ON DATABASE apps_db TO navdu_user;
GRANT ALL PRIVILEGES ON DATABASE startups_db TO navdu_user;
GRANT ALL PRIVILEGES ON DATABASE events_db TO navdu_user;
