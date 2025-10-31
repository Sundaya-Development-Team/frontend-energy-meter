# Pull image node 20 alpine (sesuai pattern lama)
FROM node:20.14-alpine

# Create working directory
WORKDIR /usr/src/app

# Copy all files to working directory
COPY . .

# Install dependencies
RUN npm install --silent

# Build the application for production
RUN npm run build

# Expose port
EXPOSE 3000

# Serve built files with Express (proper SPA routing)
CMD ["node", "server-spa.js"]
