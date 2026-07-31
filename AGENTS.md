# AGENTS.md

## Project Overview

PHP fullstack CRUD application with JWT authentication and role-based access. Spanish-language UI and comments throughout.

**Stack:** PHP 8+, MySQL 8, vanilla JS (ES modules), Firebase PHP-JWT, HTML/CSS. No framework.

## Architecture

```
Config/database.php    — PDO MySQL connection (root/root, db: crud_estudiantes)
Controller/            — AuthController, UserController, DirectoryController
Model/                 — User.php, Directory.php (raw PDO, no ORM)
middlewares/auth.php   — JWT token validation (HS256, 1hr expiry)
Public/                — Web root (served by PHP built-in server)
  api/index.php        — Router: dispatches by URI path to handler files
  api/*.php            — Individual endpoint handlers
  js/                  — ES modules (auth.js, commons.js, dashboard.js, report.js)
  index.html           — Login page
  dashboard.html       — Main dashboard
crud_estudiantes.sql   — Database schema + seed data
```

## Setup

```bash
composer install
mysql -u root -p < crud_estudiantes.sql
php -S localhost:8000 -t Public    # Web server
```

Admin credentials: `admin@test.com` / `123456`

## Key Files

- `config.php` (root) — JWT_SECRET and JWT_EXP constants
- `Config/database.php` — DB credentials (hardcoded: root/root)
- `Public/api/index.php` — All API routing lives here
- `middlewares/auth.php` — Include before protected endpoints

## API Routes

All routes under `/api/`:
- `POST /api/auth` — Login, returns JWT
- `GET /api/users` — List users (auth required)
- `POST /api/create` — Create user (auth required)
- `POST /api/update` — Update user (auth required)
- `POST /api/delete` — Delete user (auth required)
- `GET /api/directory` — List directory entries
- `POST /api/create/directory` — Create directory entry
- `POST /api/update/directory` — Update directory entry
- `POST /api/delete/directory` — Delete directory entry
- `GET /api/report` — Report data

## Conventions

- **No build step, no tests, no linter** — verify changes manually via browser/PHP server
- **Spanish** — comments, UI text, variable names, database column names
- **No framework routing** — API routing is a switch statement in `Public/api/index.php`; add new routes there
- **No ORM** — models use raw PDO queries
- **JS modules** — `commons.js` exports shared DOM refs and token; import pattern: `import { token } from './commons.js'`
- **Auth flow** — POST credentials to `/api/auth`, store token in localStorage, send as `Authorization: Bearer <token>` header

## Gotchas

- SQL dump filename is `crud_estudiantes.sql`, NOT `database.sql` as readme claims
- DB credentials hardcoded in `Config/database.php` (not env-based)
- JWT secret hardcoded in `config.php` (root level)
- API handlers include `index.php` (the router) via `require_once` — do not change that file without understanding the routing
- `token` in `commons.js` is read at module load time from localStorage
