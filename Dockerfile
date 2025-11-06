# Pull image node 20 alpine (sesuai pattern lama)
FROM node:20.14-alpine

# Build argument untuk environment mode (default: development)
ARG BUILD_MODE=development

# Create working directory
WORKDIR /usr/src/app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies (including Express)
RUN npm install --silent

# Copy rest of the files
COPY . .

# Build the application dengan mode yang sesuai
# Mode akan menentukan file .env mana yang dibaca:
# - production: membaca .env.production
# - development: membaca .env.development
RUN npm run build -- --mode ${BUILD_MODE}

# Install serve globally for production serving
RUN npm install -g serve@latest

# Expose port
EXPOSE 3000

# Serve built files (SPA mode with single flag)
CMD ["serve", "-s", "build", "-l", "3000", "--no-clipboard", "--single"]
