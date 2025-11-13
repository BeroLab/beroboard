FROM oven/bun:1.3 AS deps
WORKDIR /app

COPY bun.lock bunfig.toml package.json ./
COPY packages ./packages
COPY apps/server/package.json ./apps/server/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN bun install --frozen-lockfile --production

FROM deps AS dev-deps

RUN bun install --frozen-lockfile

FROM dev-deps AS builder
WORKDIR /app

COPY apps/web/next.config.ts ./apps/web/next.config.ts
COPY apps/web/tsconfig.json ./apps/web/tsconfig.json
COPY apps/web/postcss.config.mjs ./apps/web/postcss.config.mjs
COPY apps/web/components.json ./apps/web/components.json
COPY apps/web/next-env.d.ts ./apps/web/next-env.d.ts
COPY apps/web/src ./apps/web/src

WORKDIR /app/apps/web
RUN bun run build

FROM oven/bun:1.3-slim AS runner
WORKDIR /app/apps/web

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=deps /app/packages /app/packages
COPY --from=deps /app/apps/web/node_modules ./node_modules
COPY --from=deps /app/apps/web/package.json ./package.json
COPY --from=builder /app/apps/web/.next ./.next

CMD ["bun", "run", "start"]
