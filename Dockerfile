FROM nginx:alpine

# Hapus default config Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy konfigurasi nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy folder build (akan di-mount dari docker-compose)
COPY ./build /usr/share/nginx/html

EXPOSE 8001

CMD ["nginx", "-g", "daemon off;"]
