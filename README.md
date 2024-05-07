# Novel Frontend Website

## Installation
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
Enter to your server
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
- Domain - example.com
```
cd /etc/nginx/sites-available/
nano example.com
```
nginx config is as follow with ssl certificate from let's encrypt
```
server {
    server_name example.com;
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
}
server {
    if ($host = example.com) {
        return 301 https://$host$request_uri;
    }
    server_name example.com;
    listen 80;
    return 404; 
}
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
