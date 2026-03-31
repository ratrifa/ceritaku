# 📖 Ceritaku

Platform storytelling modern untuk berbagi cerpen (cerita pendek) dengan komunitas pembaca dan penulis. Dibangun dengan Laravel 12, React, dan Inertia.js.

## ✨ Fitur Utama

- 📝 **Manajemen Cerpen**: Buat, edit, publikasikan, dan kelola draft cerpen Anda
- ❤️ **Like & Bookmark**: Tandai cerita favorit dan lihat yang paling disukai
- 💬 **Sistem Komentar**: Berinteraksi dengan pembaca melalui komentar bersarang (nested comments)
- 👥 **Follow Sistem**: Ikuti penulis favorit dan dapatkan update cerita terbaru mereka
- 🏷️ **Tag & Kategori**: Organisasi cerita dengan tag untuk kemudahan pencarian
- 📖 **Reading List**: Kelola daftar bacaan personal dengan bookmark
- 👤 **Public Profile**: Lihat profil dan semua cerita dari penulis lain
- 🏠 **Home Feed**: Aliran cerita terpublikasi dengan sorting terbaru

## 🛠️ Tech Stack

### Backend
- **PHP 8.2+** - Bahasa pemrograman
- **Laravel 12** - Framework web
- **Inertia.js** - Server-side rendering bridge
- **Laravel Tinker** - REPL untuk debugging
- **Ziggy** - Route helper untuk JavaScript

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Shadcn/ui** - Component library
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Vite** - Frontend build tool

### Development & Testing
- **Pest PHP** - Modern testing framework
- **Laravel Sail** - Docker setup
- **Prettier** - Code formatter
- **ESLint** - JavaScript linter
- **Faker** - Data generation

### Tools
- **Composer** - PHP dependency management
- **npm** - Node.js package management
- **Laravel Pint** - PHP code style fixer
- **Vite** - Hot module replacement (HMR)

## 📋 Requirements

- **PHP**: 8.2 atau lebih tinggi
- **Node.js**: 18+ (untuk npm packages)
- **Database**: SQLite, MySQL, atau PostgreSQL
- **Composer**: 2.0 atau lebih tinggi
- **npm**: 9 atau lebih tinggi

## 🚀 Cara Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd ceritaku
```

### 2. Install PHP Dependencies
```bash
composer install
```

### 3. Install Node Dependencies
```bash
npm install
```

### 4. Setup Environment
```bash
# Copy .env.example ke .env
cp .env.example .env

# Generate APP_KEY
php artisan key:generate

# Buat SQLite database (atau setup database lain di .env)
touch database/database.sqlite
```

### 5. Database Migration & Seeding
```bash
# Jalankan migrasi
php artisan migrate

# (Opsional) Seeding data demo untuk development
php artisan db:seed --class=DemoContentSeeder
```

### 6. Build Frontend Assets
```bash
# Development
npm run dev

# Production
npm run build
```

## 🎯 Perintah Harian

### Development Server
```bash
# Cara 1: Jalankan semuanya (server Laravel + queue + Vite)
composer run dev

# Cara 2: Jalankan secara terpisah
php artisan serve          # Laravel server (port 8000)
npm run dev               # Vite dev server (port 5173)
php artisan queue:listen  # Queue listener
```

### Database
```bash
# Run migrations
php artisan migrate

# Rollback last migration batch
php artisan migrate:rollback

# Seed database
php artisan db:seed
php artisan db:seed --class=DemoContentSeeder

# Reset database (drop all tables)
php artisan migrate:reset
```

### Code Quality
```bash
# Format dengan Prettier (JavaScript/TypeScript)
npm run format

# Check format dengan Prettier
npm run format:check

# Lint dengan ESLint (auto-fix)
npm run lint

# Lint dengan Laravel Pint (PHP)
php artisan pint
```

### Testing
```bash
# Jalankan semua tests
php artisan test

# Jalankan dengan code coverage
php artisan test --coverage

# Jalankan test spesifik
php artisan test tests/Feature/CerpenControllerTest.php
```

### Tinker (REPL)
```bash
# Akses PHP REPL untuk debugging
php artisan tinker

# Di dalam tinker:
> User::all()
> Cerpen::limit(5)->get()
```

### Build & Deployment
```bash
# Build frontend untuk production
npm run build

# Build dengan SSR (jika diperlukan)
npm run build:ssr

# Optimize untuk production
php artisan optimize
php artisan view:cache
php artisan route:cache
php artisan config:cache
```

## 📁 Struktur Project

```
ceritaku/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # Request handlers
│   │   ├── Middleware/       # HTTP middleware
│   │   └── Requests/         # Form request validation
│   ├── Models/              # Eloquent models
│   └── Policies/            # Authorization policies
├── database/
│   ├── factories/           # Model factories
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── resources/
│   ├── css/                 # Stylesheet files
│   ├── js/                  # React components & pages
│   └── views/               # Inertia.js views
├── routes/
│   ├── web.php              # Web routes
│   ├── auth.php             # Authentication routes
│   └── settings.php         # Settings routes
├── tests/                   # Test files
├── public/                  # Public assets
├── bootstrap/               # Bootstrap application files
├── config/                  # Configuration files
├── storage/                 # File uploads & logs
└── vendor/                  # Composer dependencies
```

## 🗄️ Database Schema

### Core Models
- **User** - Profil pengguna dan otentikasi
- **Cerpen** - Artikel cerita
- **Comments** - Komentar pada cerpen (support nested)
- **Likes** - Like pada cerpen
- **Bookmark** - Saved reading list
- **Follow** - Hubungan follower-following
- **Tag** - Tag/kategori cerita
- **TagCerpen** - Junction table untuk many-to-many relationship

## 🔐 Autentikasi & Authorization

Project ini menggunakan Laravel's default authentication system. 

### Authorization
- **Policies**: `CerpenPolicy` dan `CommentsPolicy`
  - User hanya bisa edit/delete cerpen mereka sendiri
  - User hanya bisa delete komentar mereka sendiri atau penulis cerpen

### Routes yang Dilindungi
- Dashboard, Home Feed, Reading List
- CRUD Cerpen
- Like, Bookmark, Comments
- Follow dan Unfollow

## 🌐 API Routes

### Public Routes
```
GET    /                              # Landing page
GET    /cerpen/{id}                   # View cerpen detail
GET    /@{username}                   # Public profile
```

### Protected Routes (Require Authentication)
```
GET    /home                          # Home feed
GET    /reading-list                  # Reading list
GET    /cerpen                        # My stories
POST   /cerpen                        # Create story
PUT    /cerpen/{id}                   # Update story
DELETE /cerpen/{id}                   # Delete story
POST   /cerpen/{id}/like              # Toggle like
POST   /cerpen/{id}/bookmark          # Toggle bookmark
POST   /cerpen/{id}/comments          # Add comment
DELETE /cerpen/{id}/comments/{id}     # Delete comment
POST   /users/{id}/follow             # Toggle follow
```

## 📊 Demo Data

Jalankan seeder untuk populate database dengan demo content:

```bash
php artisan db:seed --class=DemoContentSeeder
```

Ini akan membuat:
- **8 Demo Users** dengan password `password`
- **80 Cerpen** (8 per user, 8 published per user)
- **10 Tag Categories**
- **Follow relationships** antara users
- **Likes & Bookmarks** (random)
- **Comments & Replies** (nested comments)

### Test User
- Email: `test@example.com`
- Password: `password`

## 🎨 Frontend Components

Proyek menggunakan **Shadcn/ui** dan **Radix UI** untuk UI components. Beberapa komponen utama:

- Avatar, Dialog, Dropdown Menu
- Button, Input, Label
- Select, Checkbox, Toggle
- Navigation Menu
- Tooltip, Separator
- Collapsible components

Lihat `resources/js/components/` untuk custom components.

## 📝 Environment Variables

Sesuaikan `.env` untuk konfigurasi:

```env
APP_NAME="Ceritaku"
APP_DEBUG=true              # true untuk development, false untuk production
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite        # atau mysql, pgsql
DB_DATABASE=database/database.sqlite

MAIL_DRIVER=log             # Setup email sesuai kebutuhan

# Queue
QUEUE_CONNECTION=database
```

## 🧪 Testing

Proyek menggunakan **Pest PHP** untuk testing:

```bash
# Jalankan semua tests
php artisan test

# Jalankan test file spesifik
php artisan test tests/Feature/CerpenControllerTest.php

# Dengan coverage report
php artisan test --coverage
```

Struktur tests:
- `tests/Feature/` - Feature & integration tests
- `tests/Unit/` - Unit tests

## 🐛 Debugging

### Laravel Pail
```bash
# Monitor logs real-time
php artisan pail

# Filter logs spesifik
php artisan pail --filter="database"
```

### Tinker Console
```bash
php artisan tinker

# Query examples
> Cerpen::with('user', 'tags', 'likes')->first()
> User::findOrFail(1)->cerpens()->latest()->get()
> Comments::whereNull('parent_id')->with('replies')->get()
```

## 📦 Deployment

### Production Build
```bash
# Install dependencies
composer install --optimize-autoloader --no-dev
npm install

# Build frontend
npm run build

# Setup environment
cp .env.example .env
php artisan key:generate

# Database migrations
php artisan migrate --force

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Docker Deployment (Laravel Sail)
```bash
# Setup with Sail
./vendor/bin/sail up -d

# Run migrations in container
./vendor/bin/sail artisan migrate
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Project ini berlisensi MIT. Lihat [LICENSE](LICENSE) untuk detail lengkap.

## 🙋 Support

Jika ada pertanyaan atau bug, silakan:
- Buka Issue di GitHub
- Hubungi developer

## 🗺️ Roadmap

- [ ] Notifikasi real-time (Websocket/Broadcast)
- [ ] Rating & Review sistem
- [ ] Series cerita
- [ ] Advanced search & filtering
- [ ] Author analytics dashboard
- [ ] Email notifications
- [ ] Social sharing integration

---

**Dibuat dengan ❤️ untuk pecinta cerita**
