FROM webdevops/php-nginx:8.2-alpine

WORKDIR /app

# Copy backend PHP
COPY backend /app/backend

# Copy frontend React build
COPY frontend/web/build /app/frontend/web/build

# Nginx document root points to backend/public
ENV WEB_DOCUMENT_ROOT=/app/backend/public

# IMPORTANT: Tell NGINX to listen on Railway's runtime port
ENV WEB_PORT=8080

EXPOSE 8080
