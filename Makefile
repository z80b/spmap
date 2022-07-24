net:
	docker network create $(notdir $(CURDIR))_network

mysql:
	docker run -d --rm --name $(notdir $(CURDIR))_mysql \
	--network $(notdir $(CURDIR))_network \
	--hostname $(notdir $(CURDIR))_mysql \
	--volume $(CURDIR)/.docker/db:/var/lib/mysql \
	--volume $(CURDIR)/.docker/mysql.cnf:/etc/mysql/my.cnf \
	-e MYSQL_ROOT_PASSWORD=12345 \
	devilbox/mysql:mysql-5.5

php:
	docker run -d --rm --name $(notdir $(CURDIR))_php \
	--network $(notdir $(CURDIR))_network \
	--volume $(CURDIR):/var/www/default/htdocs \
	devilbox/php-fpm-5.2

nginx:
	docker run -d --rm --name $(notdir $(CURDIR))_nginx \
	--network $(notdir $(CURDIR))_network \
	--volume $(CURDIR):/var/www/default/htdocs \
	--volume $(CURDIR)/.docker/nginx/drupal6.conf:/etc/httpd/vhost.d/drupal6.conf \
	-e PHP_FPM_ENABLE=1 \
	-e PHP_FPM_SERVER_ADDR=$(notdir $(CURDIR))_php \
	-p 3333:80 \
	devilbox/nginx-stable
