# Novel Frontend Website

## Technologies
> NextJs Server-side Rendering
- Ubuntu version 20.04
- [NodeJs version v18.16.0](https://nodejs.org/en)
- NextJs
- TailwindCss

## Installation (Localhost)
```bash
git clone org-117672655@github.com:TamRonYangon/novel-frontend.git
cd novel-frontend
npm install
cp .env.example .env
```
## Localhost Running
```bash
npm run dev
```
project is running at http://localhost:3000

## Server Deployment
```bash
ssh novel@20.24.184.249
```
then enter server password
```bash
sudo su
cd /var/www/html
git clone org-117672655@github.com:TamRonYangon/novel-frontend.git
cd novel-frontend
npm install
cp .env.example .env
npm run build
```

### Nginx Configuration
- Domain - abcbookmm.com
```
cd /etc/nginx/sites-available/
nano abcbookmm.com
```
nginx config is as follow with ssl certificate from let's encrypt
```
server {
    server_name abcbookmm.com;
    root /var/www/html/novel-frontend;

    index index.html index.htm index.php;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/abcbookmm.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/abcbookmm.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = abcbookmm.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
    server_name abcbookmm.com;
    listen 80;
    return 404; # managed by Certbot
}
```

> For Nginx test
```bash
nginx -t
```

> Restart Nginx
```bash
systemctl restart nginx
```

## PM2
Because of server-side rendering (SSR), we need to run npm script command with pm2.

Install pm2
```bash
sudo npm install pm2@latest -g
```

```bash
pm2 start npm --name "NOVEL-FRONTEND" -- start
```
and then we got pm2 list with id (eg., id is 1)

### For monitoring
```bash
pm2 monit
```

## Project Deployment & Git Pull
```bash
ssh novel@20.24.184.249
```
then enter server password
```
sudo su
cd /var/www/html/novel-frontend
git pull
npm run build
pm2 restart 1
```
