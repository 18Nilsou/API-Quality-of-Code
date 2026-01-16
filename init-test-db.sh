#!/bin/bash
set -e

# Create test database if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT 'CREATE DATABASE qoc_db_test'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'qoc_db_test')\gexec
EOSQL

echo "Test database 'qoc_db_test' created successfully"
