# 1. Build React frontend
FROM node:18-alpine AS frontend


WORKDIR /app/frontend
COPY frontend/web/package.json frontend/web/package-lock.json ./
RUN npm install

COPY frontend/web ./
RUN npm run build


# 2. Backend PHP server
FROM php:8.2-alpine

WORKDIR /app

# Copy backend
COPY backend /app/backend

# Copy final React build from stage 1
COPY --from=frontend /app/frontend/build /app/frontend/web/build

# Use PHP built-in server on Railway port
ENV PORT=8080

EXPOSE 8080

CMD php -S 0.0.0.0:$PORT -t /app/backend/public
