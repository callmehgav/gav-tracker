FROM php:8.2-fpm-alpine

WORKDIR /app

COPY backend /app/backend
COPY frontend/web/build /app/frontend/web/build

EXPOSE 8080

CMD ["php", "-S", "0.0.0.0:8080", "-t", "/app/backend/public"]
