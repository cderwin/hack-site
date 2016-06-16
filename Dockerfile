FROM nginx:latest

WORKDIR /var/www/hack_site
COPY public .
COPY nginx.conf /etc/nginx/conf.d/hack.conf

EXPOSE 80 443
