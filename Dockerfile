# Use a lightweight Nginx image to serve static files
FROM nginx:alpine

# Copy everything into Nginx's public folder
COPY . /usr/share/nginx/html

# Expose port 80 for Koyeb
EXPOSE 80
