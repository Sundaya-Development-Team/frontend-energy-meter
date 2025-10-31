# Pull image node 20 alpine (sesuai pattern lama)
FROM node:20.14-alpine

# Create working directory
WORKDIR /usr/src/app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies (including Express)
RUN npm install --silent

# Copy rest of the files
COPY . .

# Build the application for production
RUN npm run build

# Expose port
EXPOSE 3000

# Serve built files with Express (proper SPA routing)
CMD ["node", "server-spa.js"]
