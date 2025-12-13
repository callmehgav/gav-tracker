# Stage 1 — Build React
FROM node:18-alpine AS build-frontend
WORKDIR /app
COPY frontend/web/package*.json ./
RUN npm install
COPY frontend/web ./
RUN npm run build

# Stage 2 — PHP FPM backend
FROM php:8.2-fpm-alpine AS backend
WORKDIR /app
COPY backend /app/backend

# Stage 3 — Final NGINX + PHP-FPM production server
FROM nginx:1.27-alpine

# Copy React build into NGINX root
COPY --from=build-frontend /app/build /var/www/html

# Copy backend (PHP) into container
COPY --from=backend /app/backend /var/www/backend

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Railway port
EXPOSE 8080

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
