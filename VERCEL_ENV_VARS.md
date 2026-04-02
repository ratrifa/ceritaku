# Vercel Environment Variables Required

Untuk Vercel Production, set Environment Variables berikut di Vercel Dashboard:

## Critical Variables
```
APP_NAME=CeritaKu
APP_ENV=production
APP_KEY=base64:UarCDcxnDM+cvrOIzbDentLzXIgpmCLQx/kbsu+8DH0=
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=https://ceritaku-j5z5.vercel.app

CACHE_STORE=array
SESSION_DRIVER=cookie

# Database
DB_CONNECTION=mysql
DB_HOST=gt8-yp.h.filess.io
DB_PORT=61002
DB_DATABASE=ceritaku_sometimeon
DB_USERNAME=ceritaku_sometimeon
DB_PASSWORD=f40a903b2419886e49385b33dffa93a3222c7af8

# Logging
LOG_CHANNEL=stderr
LOG_LEVEL=debug

# Other
BCRYPT_ROUNDS=12
```

## Important Notes
- `APP_KEY` sudah di-generate, jangan ubah
- `CACHE_STORE` HARUS `array` untuk serverless (bukan `database`)
- `SESSION_DRIVER` `cookie` lebih cocok daripada `file` di serverless
- `LOG_CHANNEL=stderr` untuk debug di Vercel logs
- Endpoint database accessible dari Vercel ✅ (sudah verified)

## Validation
1. Cek Vercel Build Logs → apakah `npm run build` sukses?
2. Cek Vercel Runtime Logs → apakah ada error middleware/database?
3. Test GET `/` → harus return HTML page, bukan 500
