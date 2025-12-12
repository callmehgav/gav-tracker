FROM php:8.2-fpm-alpine AS php

# Install PHP extensions if needed
RUN docker-php-ext-install pdo pdo_mysql

FROM nginx:1.27-alpine AS nginx

WORKDIR /app

# Copy backend PHP into a directory served by PHP-FPM
COPY backend /app/backend

# Copy React build into a static folder
COPY frontend/web/build /app/frontend/web/build

# Copy NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Railway expects this)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
