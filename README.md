# Browser Games Platform

A CrazyGames-style HTML5 gaming site built with Next.js, React, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- Browse featured, latest, and category-filtered games
- Click-to-play iframe game player
- Search by title/slug
- User registration and JWT session auth (httpOnly cookie)
- Game issue reporting
- Admin panel for game CRUD and report management

## Prerequisites

- Node.js 20+
- PostgreSQL

## Setup

1. **Install dependencies**

```bash
cd browser-games-platform
npm install
```

2. **Configure environment**

```bash
cp .env.example .env
```

Edit `.env` with your database URL and a random `AUTH_SECRET`:

```bash
openssl rand -hex 32
```

3. **Run migrations and seed**

```bash
npx prisma migrate dev --name init
npm run db:seed
```

4. **Start dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Default admin account

After seeding:

- **Username:** `admin`
- **Password:** `admin123`

Change this password before going to production.

## Project structure

See the architecture doc for full route and folder layout. Key paths:

| Path | Purpose |
|------|---------|
| `/` | Homepage |
| `/game/[slug]` | Play a game |
| `/c/[slug]` | Category listing |
| `/search?s=` | Search |
| `/admin` | Admin dashboard |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed categories, games, admin user |
| `npm run db:studio` | Open Prisma Studio |
