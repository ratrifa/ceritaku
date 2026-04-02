# Vercel Deployment Checklist ✅

## Code-side Changes (Already Done ✅)

- ✅ `vercel.json` - Fixed build configuration
- ✅ `config/cache.php` - Changed to array driver (serverless-compatible)
- ✅ `public/build/` - Vite assets built and committed
- ✅ `vendor/` - PHP dependencies committed
- ✅ `api/index.php` - Entry point configured
- ✅ Database connection verified working

## Documentation (Already Created ✅)

Created 4 documentation files to guide setup:

1. **VERCEL_ENV_SETUP.md** - Step-by-step guide to set environment variables
2. **VERCEL_ENV_VARS.md** - Reference of all required variables
3. **.env.production.example** - Template for production environment
4. **README.md** - Added complete Vercel deployment section

## User Action Required 🔧

### Step 1: Set Environment Variables in Vercel Dashboard

URL: https://vercel.com/satriafebri16-4096s-projects/ceritaku-j5z5/settings/environment-variables

Copy-paste from `VERCEL_ENV_SETUP.md` or use `.env.production.example` as template:

**Critical Variables:**

- APP_KEY (from .env, starts with "base64:")
- APP_ENV=production
- APP_DEBUG=false
- CACHE_STORE=array
- SESSION_DRIVER=cookie
- DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
- LOG_CHANNEL=stderr

### Step 2: Wait for Auto-Redeploy

After setting variables, Vercel automatically triggers deployment (2-3 minutes)

### Step 3: Verify Deployment

**Check Build Success:**

- Go to Vercel Dashboard → Deployments → Latest deployment
- Click Build & Logs
- Verify `npm run build` completed without errors

**Check Runtime Success:**

- Go to Runtime Logs
- No error traces = Success ✅
- If error 500: Check logs for stack trace and debug

**Test Application:**

```
https://ceritaku-j5z5.vercel.app
```

## If Deployment Fails

### Error 500 on homepage

**Most likely causes (in order):**

1. APP_KEY not set or invalid → Set in Environment Variables
2. Database connection error → Verify DB_HOST, DB_PORT, credentials
3. Cache driver issue → Must be "array" not "database"
4. Missing environment variable → Check all variables in VERCEL_ENV_SETUP.md

**Debug Steps:**

1. Check Vercel Runtime Logs for full stack trace
2. Verify all environment variables are set (no blank values)
3. Test database connection locally: `php test-db.php` (removed, but replicable)
4. Ensure CACHE_STORE=array in environment variables

### Build fails

**Most likely causes:**

1. `npm run build` failure → Check if node_modules properly installed
2. PHP version mismatch → vercel-php@0.9.0 for PHP 8.2+

**Debug Steps:**

1. Check Vercel Build Logs (not Runtime Logs)
2. Redeploy by pushing new commit to master branch

## Verification Checklist

Before considering deployment complete:

- [ ] All environment variables set in Vercel Dashboard
- [ ] Vercel deployment status shows "Ready"
- [ ] Build logs show no errors (npm run build succeeded)
- [ ] Can access https://ceritaku-j5z5.vercel.app without 500 error
- [ ] Homepage loads with articles/content
- [ ] Can navigate to different routes
- [ ] Database queries return data (articles visible)

## Files Available for Reference

```
ceritaku/
├── VERCEL_ENV_SETUP.md       ← Step-by-step guide
├── VERCEL_ENV_VARS.md        ← Complete reference
├── .env.production.example   ← Production template
├── vercel.json               ← Build config (already fixed)
├── config/cache.php          ← Cache config (already fixed)
└── README.md                 ← Includes deployment section
```

## Next Steps After Deployment

1. Setup custom domain (if needed)
    - Go to Vercel Dashboard → Settings → Domains
2. Setup CI/CD
    - GitHub → Settings → Define branch deployments
    - Set production branch to "master"
3. Monitor & Logging
    - Check Vercel logs regularly
    - Setup error tracking if needed
    - Monitor database query performance

## Important Notes

- **Do NOT commit `.env` file to GitHub** (it's in .gitignore)
- **APP_KEY should never be shared** - keep secure in Vercel only
- **Database password is sensitive** - verify VERCEL_ENV_VARS.md is not in public
- **vendor/ folder** must stay in git (not usual, but required for Vercel)
- **public/build/** must stay in git (Vite assets)
- **Storage/logs** will be ephemeral in Vercel (resets on redeploy)

---

**Status: Ready for User to Set Environment Variables** ✅

All code changes and documentation are complete. The application will work after user sets the environment variables in Vercel Dashboard.
