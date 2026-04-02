# Vercel Environment Variables Setup Guide

## Steps to Set Environment Variables in Vercel Dashboard

1. Go to: https://vercel.com/satriafebri16-4096s-projects/ceritaku-j5z5/settings/environment-variables

2. Add the following environment variables:

### Copy-paste these variables one by one:

**APP Configuration:**
```
Key: APP_NAME
Value: CeritaKu
```

```
Key: APP_ENV
Value: production
```

```
Key: APP_KEY
Value: base64:UarCDcxnDM+cvrOIzbDentLzXIgpmCLQx/kbsu+8DH0=
```

```
Key: APP_DEBUG
Value: false
```

```
Key: APP_TIMEZONE
Value: UTC
```

```
Key: APP_URL
Value: https://ceritaku-j5z5.vercel.app
```

**Cache & Session Configuration:**
```
Key: CACHE_STORE
Value: array
```

```
Key: SESSION_DRIVER
Value: cookie
```

**Database Configuration:**
```
Key: DB_CONNECTION
Value: mysql
```

```
Key: DB_HOST
Value: gt8-yp.h.filess.io
```

```
Key: DB_PORT
Value: 61002
```

```
Key: DB_DATABASE
Value: ceritaku_sometimeon
```

```
Key: DB_USERNAME
Value: ceritaku_sometimeon
```

```
Key: DB_PASSWORD
Value: f40a903b2419886e49385b33dffa93a3222c7af8
```

**Logging Configuration:**
```
Key: LOG_CHANNEL
Value: stderr
```

```
Key: LOG_LEVEL
Value: debug
```

**Other:**
```
Key: BCRYPT_ROUNDS
Value: 12
```

## After Setting Variables

1. Vercel akan automatically redeploy
2. Wait 2-3 minutes untuk deployment selesai
3. Test: https://ceritaku-j5z5.vercel.app
4. Jika error 500:
   - Check Vercel Deployments → Logs → Runtime Logs
   - Cari error trace untuk debugging lebih lanjut

## Important Notes

- Jangan share APP_KEY dan DB_PASSWORD di public
- Pastikan semua variables sudah ter-set sebelum test
- Jika perlu reset, bisa re-run `php artisan key:generate` lokal dan update APP_KEY di Vercel
