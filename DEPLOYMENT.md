# Deployment Guide - ERA Home KG

## Server Information

| Parameter | Value |
|-----------|-------|
| **IP Address** | 185.196.117.49 |
| **SSH User** | root |
| **Auth Method** | SSH Key (Alex@DESKTOP-P0V2V04) |
| **Backup Password** | n.NYN8.YSfiTeT |
| **Web Server** | Nginx |
| **OS** | Ubuntu Linux |
| **Domain** | era-home.kg |
| **Server Path** | /var/www/era-concept |

## Deployment Steps

### 1. Pull Latest Changes from GitHub
```powershell
cd "c:\Users\Makkaroshka\Desktop\era concept home KG\barnhouse-vibes-kg"
$env:GIT_SSL_NO_VERIFY="true"
git pull origin main
```

### 2. Build the Project
```powershell
npm run build
```

### 3. Deploy to Server (Incremental - Only Changed Files)
```powershell
# Using rsync (recommended for incremental deploys)
rsync -avz --delete dist/ root@185.196.117.49:/var/www/era-concept/

# Or using scp for full deploy
scp -r dist/* root@185.196.117.49:/var/www/era-concept/
```

### 4. Fix Permissions (if needed)
```powershell
ssh root@185.196.117.49 "chmod -R 755 /var/www/era-concept/ && chown -R www-data:www-data /var/www/era-concept/"
```

### 5. Reload Nginx (if config changed)
```powershell
ssh root@185.196.117.49 "systemctl reload nginx"
```

## Quick Deploy Command (All-in-One)
```powershell
cd "c:\Users\Makkaroshka\Desktop\era concept home KG\barnhouse-vibes-kg"
$env:GIT_SSL_NO_VERIFY="true"
git pull origin main && npm run build && scp -r dist/* root@185.196.117.49:/var/www/era-concept/ && ssh root@185.196.117.49 "chmod -R 755 /var/www/era-concept/"
```

## SSH Key Setup (Already Configured)
- Public key location: `~/.ssh/id_rsa.pub`
- Key identity: `Alex@DESKTOP-P0V2V04`
- Status: ✅ Added to server's `~/.ssh/authorized_keys`

## Server Configuration
- SSL: Let's Encrypt certificates
- Gzip: Enabled for all text resources
- Caching: Aggressive caching for static assets
- SPA: Configured with fallback to index.html

## Troubleshooting

### Site not loading after deploy
```powershell
# Check permissions
ssh root@185.196.117.49 "ls -la /var/www/era-concept/"

# Fix permissions
ssh root@185.196.117.49 "chmod -R 755 /var/www/era-concept/ && chown -R www-data:www-data /var/www/era-concept/"
```

### Check Nginx status
```powershell
ssh root@185.196.117.49 "systemctl status nginx"
```

### Check Nginx logs
```powershell
ssh root@185.196.117.49 "tail -50 /var/log/nginx/error.log"
```
