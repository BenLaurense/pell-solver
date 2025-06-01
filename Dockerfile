# Stage 1: Build React frontend
FROM node:18 AS frontend
WORKDIR /app
COPY frontend/ ./
RUN npm install
RUN npm run build

# Stage 2: Build Flask backend with frontend served
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install Flask and dependencies
WORKDIR /app
COPY backend/ ./backend/
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend build to serve via Flask
COPY --from=frontend /app/build ./frontend

# Expose port and set entrypoint
EXPOSE 10000
CMD ["python", "backend/backend.py"]
