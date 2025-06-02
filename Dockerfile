FROM node:18 AS frontend
WORKDIR /app
COPY frontend/ ./
RUN npm install
RUN npm run build

FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY backend/ ./backend/
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend build to serve via Flask
COPY --from=frontend /app/build ./frontend

EXPOSE 10000
CMD ["gunicorn", "backend.backend:app", "--bind", "0.0.0.0:10000"]
