FROM webdevops/php-nginx:8.2-alpine

WORKDIR /app

# Copy backend PHP
COPY backend /app/backend

# Copy frontend React build
COPY frontend/web/build /app/frontend/web/build

# Set document root to the backend public folder
ENV WEB_DOCUMENT_ROOT=/app/backend/public

# Railway will inject $PORT, so bind NGINX to it
ENV WEB_PORT=${PORT}

EXPOSE 8080
