# -----------------------------------------------------
# Stage 1: Build React frontend
# -----------------------------------------------------
FROM node:18-alpine AS build-frontend

WORKDIR /app/frontend

# Copy dependency files
COPY frontend/web/package*.json ./

RUN npm install

# Copy the rest of the React project
COPY frontend/web/ ./

# Build optimized production assets
RUN npm run build


# -----------------------------------------------------
# Stage 2: PHP backend + serve built React
# -----------------------------------------------------
FROM php:8.2-alpine

WORKDIR /app

# Install PHP extensions (if needed)
RUN docker-php-ext-install pdo pdo_mysql

# Copy backend
COPY backend /app/backend

# Copy built React output FROM stage 1
COPY --from=build-frontend /app/frontend/build /app/backend/public

# Expose port (Railway injects PORT)
EXPOSE 8080

# Start PHP development server
CMD php -S 0.0.0.0:${PORT:-8080} -t /app/backend/public
