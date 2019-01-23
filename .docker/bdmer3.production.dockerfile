FROM nginx:1.15.8-1~stretch
COPY ./dist/prod /var/www/dist/prod
COPY ./.docker/nginx.conf /etc/nginx/conf.d/angular-seed.template
