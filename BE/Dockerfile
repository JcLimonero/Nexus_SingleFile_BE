# syntax=docker/dockerfile:1.7
# CodeIgniter 4 backend — Railway / any container host
# Build: docker build -t nexus-be ./BE
# Run:   docker run -p 8080:8080 --env-file BE/.env nexus-be

FROM composer:2 AS deps
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-scripts \
    --no-interaction \
    --prefer-dist

FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
        nginx \
        gettext \
        curl \
        icu-libs \
        oniguruma \
        libzip \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        icu-dev \
        oniguruma-dev \
        libzip-dev \
        curl-dev \
    && docker-php-ext-install -j$(nproc) \
        mysqli \
        pdo_mysql \
        intl \
        mbstring \
        zip \
        opcache \
        bcmath \
    && apk del --purge .build-deps \
    && rm -rf /tmp/* /var/cache/apk/*

WORKDIR /var/www/html

COPY --from=deps /app/vendor ./vendor
COPY . .

RUN mkdir -p writable/cache writable/logs writable/session writable/uploads writable/debugbar \
    && chown -R www-data:www-data writable \
    && chmod -R 775 writable \
    && rm -f public/test.php public/test_db.php

COPY docker/nginx.conf /etc/nginx/http.d/default.conf.template
COPY docker/php.ini /usr/local/etc/php/conf.d/zz-app.ini
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/zz-app.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/" || exit 1

ENTRYPOINT ["entrypoint.sh"]
