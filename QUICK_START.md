# 🚀 QUICK START - Vercel Deployment

## HANYA 2 LANGKAH!

### Langkah 1: Set Environment Variables (5 menit)

**1. Buka link ini:**

```
https://vercel.com/satriafebri16-4096s-projects/ceritaku-j5z5/settings/environment-variables
```

**2. Copy-paste 13 variables ini satu per satu:**

```
APP_NAME                  = CeritaKu
APP_ENV                   = production
APP_KEY                   = base64:UarCDcxnDM+cvrOIzbDentLzXIgpmCLQx/kbsu+8DH0=
APP_DEBUG                 = false
APP_TIMEZONE              = UTC
APP_URL                   = https://ceritaku-j5z5.vercel.app
CACHE_STORE               = array
SESSION_DRIVER            = cookie
DB_CONNECTION             = mysql
DB_HOST                   = gt8-yp.h.filess.io
DB_PORT                   = 61002
DB_DATABASE               = ceritaku_sometimeon
DB_USERNAME               = ceritaku_sometimeon
DB_PASSWORD               = f40a903b2419886e49385b33dffa93a3222c7af8
LOG_CHANNEL               = stderr
```

**3. Save & wait 2-3 menit untuk auto-redeploy**

### Langkah 2: Test Aplikasi ✅

Akses: https://ceritaku-j5z5.vercel.app

---

## ❗ PENTING

- ✅ Semua code sudah fix
- ✅ Build config sudah benar
- ✅ Database connection tested
- ⏳ HANYA perlu: Set environment variables di Vercel

## Jika error 500:

1. Verifikasi semua 15 variables sudah ter-set
2. Check Vercel Runtime Logs untuk error trace
3. Pastikan APP_KEY = `base64:...` (jangan ubah)
4. Pastikan CACHE_STORE = `array` (bukan database)

---

**Dokumentasi lengkap:**

- `DEPLOYMENT_CHECKLIST.md` - Checklist lengkap
- `VERCEL_ENV_SETUP.md` - Guide detail
- `README.md` - Section "Deployment (Vercel)"
