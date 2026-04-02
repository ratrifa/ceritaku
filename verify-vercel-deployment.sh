#!/bin/bash
# Vercel Deployment Verification Script
# Run this to verify everything is ready for Vercel deployment

echo "🔍 Vercel Deployment Verification"
echo "=================================="
echo ""

# 1. Check vercel.json exists and is valid
echo "1. Checking vercel.json..."
if [ -f vercel.json ]; then
    echo "   ✅ vercel.json exists"
    if grep -q '"installCommand"' vercel.json && grep -q '"buildCommand"' vercel.json; then
        echo "   ✅ Install and build commands configured"
    else
        echo "   ❌ Missing install/build commands"
        exit 1
    fi
else
    echo "   ❌ vercel.json not found"
    exit 1
fi
echo ""

# 2. Check Vite build output
echo "2. Checking Vite build output..."
if [ -f "public/build/manifest.json" ]; then
    echo "   ✅ public/build/manifest.json exists"
    echo "   ✅ Vite build artifacts present"
else
    echo "   ⚠️  public/build/manifest.json missing"
    echo "   ℹ️  Run 'npm run build' to generate"
fi
echo ""

# 3. Check vendor folder
echo "3. Checking PHP dependencies..."
if [ -d "vendor" ] && [ -f "vendor/autoload.php" ]; then
    echo "   ✅ vendor/ folder exists with autoload.php"
else
    echo "   ⚠️  vendor/ folder missing"
    echo "   ℹ️  Run 'composer install' to generate"
fi
echo ""

# 4. Check cache config
echo "4. Checking cache configuration..."
if grep -q "'default' => env('CACHE_STORE', 'array')" config/cache.php; then
    echo "   ✅ Cache store set to 'array' (serverless-compatible)"
else
    echo "   ❌ Cache store not properly configured"
    exit 1
fi
echo ""

# 5. Check API entry point
echo "5. Checking API entry point..."
if [ -f "api/index.php" ]; then
    echo "   ✅ api/index.php exists"
    if grep -q "public/index.php" api/index.php; then
        echo "   ✅ API routes to public/index.php correctly"
    else
        echo "   ❌ API routing incorrect"
        exit 1
    fi
else
    echo "   ❌ api/index.php not found"
    exit 1
fi
echo ""

# 6. Check database connectivity
echo "6. Checking database connectivity..."
php -r "
try {
    \$pdo = new PDO(
        'mysql:host=gt8-yp.h.filess.io:61002;dbname=ceritaku_sometimeon',
        'ceritaku_sometimeon',
        'f40a903b2419886e49385b33dffa93a3222c7af8',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo '   ✅ Database connection verified';
    echo PHP_EOL;
} catch (Exception \$e) {
    echo '   ⚠️  Database connection failed: ' . \$e->getMessage();
    echo PHP_EOL;
}" 2>/dev/null || echo "   ⚠️  Cannot verify database (PHP issue)"
echo ""

# 7. Check git status
echo "7. Checking git status..."
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "   ✅ Inside git repository"
    if [ -z "$(git status --porcelain)" ]; then
        echo "   ✅ Working directory clean (all changes committed)"
    else
        echo "   ⚠️  Uncommitted changes:"
        git status --short | sed 's/^/      /'
    fi
else
    echo "   ❌ Not inside git repository"
fi
echo ""

# 8. Summary
echo "=================================="
echo "✅ Verification Complete!"
echo ""
echo "NEXT STEPS:"
echo "1. Set environment variables in Vercel Dashboard:"
echo "   https://vercel.com/satriafebri16-4096s-projects/ceritaku-j5z5/settings/environment-variables"
echo ""
echo "2. Refer to QUICK_START.md for exact environment variables to set"
echo ""
echo "3. Push any uncommitted changes:"
echo "   git status"
echo "   git add ."
echo "   git commit -m 'Deploy to Vercel'"
echo "   git push"
echo ""
echo "4. Vercel will auto-deploy after push"
echo "=================================="
