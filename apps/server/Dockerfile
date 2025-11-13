FROM oven/bun:1.1 AS deps
WORKDIR /app

COPY bun.lock bunfig.toml package.json ./
COPY packages ./packages
COPY apps/server/package.json ./apps/server/package.json

RUN bun install --frozen-lockfile --production

FROM deps AS dev-deps

RUN bun install --frozen-lockfile

FROM dev-deps AS builder
WORKDIR /app/apps/server

COPY apps/server/tsconfig.json ./tsconfig.json
COPY apps/server/tsdown.config.ts ./tsdown.config.ts
COPY apps/server/src ./src

RUN bun run build

FROM oven/bun:1.1-slim AS runner
WORKDIR /app/apps/server

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=deps /app/packages /app/packages
COPY --from=deps /app/apps/server/node_modules ./node_modules
COPY --from=deps /app/apps/server/package.json ./package.json
COPY --from=builder /app/apps/server/dist ./dist

CMD ["bun", "./dist/index.js"]
