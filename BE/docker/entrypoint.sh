#!/bin/sh
set -eu

: "${PORT:=8080}"
export PORT

# Render nginx config with PORT from env (Railway/Render/Fly inject it)
envsubst '${PORT}' \
  < /etc/nginx/http.d/default.conf.template \
  > /etc/nginx/http.d/default.conf

# Ensure writable dirs exist (mounted volumes may be empty on first boot)
mkdir -p /var/www/html/writable/cache \
         /var/www/html/writable/logs \
         /var/www/html/writable/session \
         /var/www/html/writable/uploads
chown -R www-data:www-data /var/www/html/writable
chmod -R 775 /var/www/html/writable

# Start PHP-FPM in background; nginx in foreground (PID 1)
php-fpm -D
exec nginx -g 'daemon off;'
