# ===== STAGE 1: Build =====
FROM node:18.14-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (for better caching)
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm install --silent

# Copy source code
COPY . .

# Build the application with optimizations
RUN npm run build

# ===== STAGE 2: Production =====
FROM node:18.14-alpine

# Set working directory
WORKDIR /usr/src/app

# Install serve globally for serving static files
RUN npm install -g serve

# Copy built files from build stage
COPY --from=build /usr/src/app/build ./build

# Expose port
EXPOSE 3000

# Serve built files with compression
CMD ["serve", "-s", "build", "-l", "3000", "--no-clipboard"]
