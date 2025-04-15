#!/bin/sh
python -c "from app.db.models.base import Base; from app.db.session import engine; Base.metadata.create_all(bind=engine)"
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload