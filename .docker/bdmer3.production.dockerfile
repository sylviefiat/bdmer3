FROM nginx
COPY ./dist/prod /var/www/dist/prod
COPY ./.docker/nginx.conf /etc/nginx/conf.d/angular-seed.template
