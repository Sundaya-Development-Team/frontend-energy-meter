FROM nginx:alpine

# Hapus default config Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy konfigurasi nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port Nginx
EXPOSE 8001

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
