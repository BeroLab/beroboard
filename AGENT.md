# Blaboard - AI Agent & Developer Guide

This document serves as the primary context source for AI agents and developers working on the **Blaboard** project.

## Commands

```bash
# Development
bun run dev              # Start all apps (web + server)
bun run dev:web          # Frontend only (port 3001)
bun run dev:server       # Backend only (port 3000)

# Build & Type Check
bun run build            # Build all workspaces
bun run check-types      # TypeScript check across all

# Code Quality (Biome)
bun run check            # Format & lint
bun run lint             # Alias for check

# Database (MongoDB + Prisma)
bun run db:start         # Start Docker container
bun run db:push          # Push schema to database
bun run db:generate      # Generate Prisma client
bun run db:studio        # Open Prisma Studio UI
bun run db:stop          # Stop container
```

## Architecture

**Monorepo** managed by Turborepo + Bun workspaces.

### Apps
- **`apps/web`** - Next.js 16, React 19, Tailwind v4, shadcn/ui (port 3001)
- **`apps/server`** - ElysiaJS backend API (port 3000)

### Packages
- **`packages/auth`** - Better Auth config (Google + GitHub social login, no email/password)
- **`packages/db`** - Prisma ORM + MongoDB (requires Replica Set for transactions)
- **`packages/env`** - T3 Env type-safe environment variables
- **`packages/config`** - Shared TypeScript configuration

## Tech Stack

- **Runtime:** Bun
- **Frontend:** Next.js 16 + React 19 + React Compiler + Tailwind v4
- **Backend:** ElysiaJS (type-safe HTTP framework)
- **Database:** MongoDB 7 (Replica Set required) + Prisma 7
- **Auth:** Better Auth with database sessions (7-day expiry)
- **UI Components:** shadcn/ui + Base UI + Lucide icons
- **Linting/Formatting:** Biome (tabs, double quotes, Tailwind class sorting)

## Authentication (Better Auth)

### Configuration (`packages/auth`)
- **Location:** `packages/auth/src/index.ts`
- **Strategies:** Social only (Google and GitHub). Email/Password is **disabled**.
- **Database Adapter:** Prisma Adapter (MongoDB)
- **Session Management:** Database-backed sessions

### Role Management
- **Default Role:** `ADMIN`
- **Implementation:** Injected via `user.additionalFields` in Better Auth config
- **Schema:** `User` model in Prisma has a `role` field

### Cross-Origin & Cookie Settings
Since Web (3001) and API (3000) run on different ports:
- **CORS:** Server allows `env.CORS_ORIGIN` (http://localhost:3001)
- **Production:** `SameSite: "none"`, `Secure: true`
- **Development:** `SameSite: "lax"`, `Secure: false`

### Frontend Integration
- **Client:** `apps/web/src/lib/auth-client.ts` points to `NEXT_PUBLIC_SERVER_URL`
- **Login:** Uses `authClient.signIn.social`
- **Callback URL:** Must be absolute: `${window.location.origin}/dashboard`

### Backend Integration
- **Plugin:** `apps/server/src/plugins/auth.plugin.ts` exposes `/api/auth/*`
- **Middleware:** `apps/server/src/middleware/auth.middleware.ts` injects `user` and `session` into Elysia context

## Database (MongoDB & Prisma)

- **Type:** MongoDB with **Replica Set** (`rs0`) required for transactions
- **Docker Setup:** Located in `packages/db/docker-compose.yml`
- **Prisma Schema:** Split across `packages/db/prisma/schema/` (schema.prisma, auth.prisma, org.prisma)
- **KeyFile:** `packages/db/mongo-key/replica.key` for internal authentication

Always run `db:generate` after schema changes.

## UI Components

**Always check for shadcn components first:**
1. If the component exists in `apps/web/src/components/ui/`, use it
2. If it doesn't exist but is available in shadcn, install it: `npx shadcn@latest add <component>`
3. Only create custom components if shadcn doesn't have what you need

## Environment Variables

Managed via `@beroboard/env`:
- **Web:** `.env` (needs `NEXT_PUBLIC_SERVER_URL`)
- **Server:** `.env` (needs `DATABASE_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_*`, `GITHUB_*`)

## Key Patterns

**Biome Config:** Uses `cn`, `clsx`, `cva` for Tailwind class sorting. Format with tabs, double quotes.
