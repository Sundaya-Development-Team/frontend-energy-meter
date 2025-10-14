# ---------- BUILD STAGE ----------
FROM node:18.14-alpine AS build

WORKDIR /usr/src/app

# Copy dependency file terlebih dahulu (untuk efisiensi cache)
COPY package*.json ./
RUN npm install --silent

# Copy semua source project
COPY . .

# Build React app untuk production
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM nginx:alpine

# Hapus default config Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy konfigurasi nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build dari stage pertama ke folder html Nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 3001
EXPOSE 3001

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
