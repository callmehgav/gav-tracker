# -----------------------------------------------------
# Stage 1: Build React frontend
# -----------------------------------------------------
FROM node:18-alpine AS build-frontend

# Create working directory
WORKDIR /app

# Copy package files first (better caching)
COPY frontend/web/package*.json ./frontend/

WORKDIR /app/frontend
RUN npm install

# Copy the rest of the frontend
COPY frontend/web ./frontend

# Build production React bundle
RUN npm run build


# -----------------------------------------------------
# Stage 2: PHP backend + serve React
# -----------------------------------------------------
FROM php:8.2-alpine

# Install PHP extensions you need
RUN docker-php-ext-install pdo pdo_mysql

# Working directory for backend
WORKDIR /app

# Copy backend PHP code
COPY backend /app/backend

# Copy React build output into backend public folder
COPY --from=build-frontend /app/frontend/build /app/backend/public/frontend

# Expose the port Railway injects
EXPOSE 8080

# Use PHP’s built-in web server
# Serve backend/public as the root
CMD php -S 0.0.0.0:${PORT} -t /app/backend/public
