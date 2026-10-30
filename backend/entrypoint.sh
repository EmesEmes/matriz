#!/bin/sh
# Arranque del backend dentro del contenedor.
#
# Las tablas ya no las crea main.py con create_all: las crea y actualiza
# Alembic. Por eso este script corre las migraciones ANTES de levantar
# uvicorn; si fallan, el contenedor no arranca, que es lo que queremos
# (mejor caido y visible que corriendo contra un esquema equivocado).
set -e

echo "==> Aplicando migraciones"
alembic upgrade head

echo "==> Levantando uvicorn"
exec uvicorn app.main:app --host 0.0.0.0 --port 8000