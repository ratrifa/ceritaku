# Step-by-Step Vercel Deployment Guide

## PERSIAPAN SELESAI ✅

Semua code sudah fix. Sekarang tinggal set environment variables.

---

## STEP-BY-STEP DEPLOYMENT

### STEP 1: Go to Vercel Environment Variables

**URL:**

```
https://vercel.com/satriafebri16-4096s-projects/ceritaku-j5z5/settings/environment-variables
```

**What you'll see:**

- Page title: "ceritaku → Settings → Environment Variables"
- Button "Add New" on the right
- Empty table or existing variables

---

### STEP 2: Add 15 Environment Variables

**For EACH variable below:**

1. Click "Add New" button
2. Paste the Key (left column)
3. Paste the Value (right column)
4. Leave "Production" selected
5. Click "Save" (or it auto-saves)
6. Repeat for next variable

**VARIABLE 1:**

```
Key:   APP_NAME
Value: CeritaKu
```

**VARIABLE 2:**

```
Key:   APP_ENV
Value: production
```

**VARIABLE 3:**

```
Key:   APP_KEY
Value: base64:UarCDcxnDM+cvrOIzbDentLzXIgpmCLQx/kbsu+8DH0=
```

**VARIABLE 4:**

```
Key:   APP_DEBUG
Value: false
```

**VARIABLE 5:**

```
Key:   APP_TIMEZONE
Value: UTC
```

**VARIABLE 6:**

```
Key:   APP_URL
Value: https://ceritaku-j5z5.vercel.app
```

**VARIABLE 7:**

```
Key:   CACHE_STORE
Value: array
```

**VARIABLE 8:**

```
Key:   SESSION_DRIVER
Value: cookie
```

**VARIABLE 9:**

```
Key:   DB_CONNECTION
Value: mysql
```

**VARIABLE 10:**

```
Key:   DB_HOST
Value: gt8-yp.h.filess.io
```

**VARIABLE 11:**

```
Key:   DB_PORT
Value: 61002
```

**VARIABLE 12:**

```
Key:   DB_DATABASE
Value: ceritaku_sometimeon
```

**VARIABLE 13:**

```
Key:   DB_USERNAME
Value: ceritaku_sometimeon
```

**VARIABLE 14:**

```
Key:   DB_PASSWORD
Value: f40a903b2419886e49385b33dffa93a3222c7af8
```

**VARIABLE 15:**

```
Key:   LOG_CHANNEL
Value: stderr
```

---

### STEP 3: Verify All Variables Are Set

After adding all 15 variables, refresh the page to verify:

- [ ] All 15 variables showing in the table
- [ ] No empty values
- [ ] All values match exactly as copied

---

### STEP 4: Wait for Auto-Deployment

After setting variables, Vercel automatically starts deployment:

1. Go to: https://vercel.com/satriafebri16-4096s-projects/ceritaku-j5z5/deployments
2. You should see a new deployment starting
3. Status will change: "Queued" → "Building" → "Ready"
4. Wait until status is **"Ready"** (green checkmark)
5. This takes 2-3 minutes

**What's happening:**

- Vercel pulls latest code from GitHub
- Runs `npm install`
- Runs `npm run build`
- Deploys to production

---

### STEP 5: Test Application

Once deployment status is "Ready":

1. Open browser
2. Go to: https://ceritaku-j5z5.vercel.app
3. Should see homepage with articles
4. No error 500!

---

## ✅ SUCCESS CHECKLIST

- [ ] Opened Vercel Environment Variables page
- [ ] Added all 15 variables
- [ ] Verified all variables in the table
- [ ] Saw new deployment starting
- [ ] Waited for "Ready" status
- [ ] Tested app at https://ceritaku-j5z5.vercel.app
- [ ] Homepage loaded without error

---

## 🚨 IF SOMETHING GOES WRONG

### Error 500 on homepage

**Cause:** Usually missing or incorrect environment variable

**Fix (in order):**

1. Check Vercel Environment Variables again (verify all 15 set)
2. Check if any value is blank
3. Verify APP_KEY = `base64:UarCDcxnDM+cvrOIzbDentLzXIgpmCLQx/kbsu+8DH0=` (don't change!)
4. Check Vercel Deployments → Runtime Logs for error details

### Deployment stuck on "Building"

**Fix:**

1. Wait 5 more minutes (npm install can be slow)
2. If still stuck after 10 min: Deployments → Redeploy button

### Can't find Vercel settings page

**Fix:**

- Make sure you're logged in to Vercel
- Go to: vercel.com
- Find project "ceritaku-j5z5"
- Click it
- Click "Settings" tab
- Click "Environment Variables" in left menu

---

## ⏱️ TOTAL TIME: ~15 minutes

- Adding variables: ~5 min
- Deployment: ~3 min
- Testing: ~1 min
- **Buffer for issues: ~5 min**

---

## 🎉 WHAT HAPPENS AFTER

When deployment is "Ready" and app works:

✅ Application is LIVE

- URL: https://ceritaku-j5z5.vercel.app
- Users can access it
- Database connected
- Frontend working
- Backend working

---

## 📖 REFERENCE

If stuck at any step:

- DEPLOY_NOW.md - Main instructions
- DOCS.md - Documentation index
- DEPLOYMENT_CHECKLIST.md - Full checklist
- Vercel Dashboard Logs - Error details

---

**YOU ARE HERE:** About to set environment variables

**NEXT STEP:** Go to https://vercel.com/.../environment-variables and start adding variables!

🚀 Let's deploy!
