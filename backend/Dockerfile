# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create a script that runs migrations and then starts the app
RUN echo '#!/bin/sh\npython -c "from app.db.models.base import Base; from app.db.session import engine; Base.metadata.create_all(bind=engine)"\nexec uvicorn main:app --host 0.0.0.0 --port 8000 --reload' > /start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]