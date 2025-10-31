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

# Install serve globally for production serving
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Serve built files (production mode)
CMD ["serve", "-s", "build", "-l", "3000", "--no-clipboard"]
