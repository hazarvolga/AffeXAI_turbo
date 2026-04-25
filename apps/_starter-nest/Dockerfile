# --- Build stage ---
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/ packages/
COPY apps/_starter-nest/ apps/_starter-nest/

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @affex/starter-nest build

# --- Production stage ---
FROM node:22-alpine AS production

RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

COPY --from=builder /app/apps/_starter-nest/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/_starter-nest/package.json ./package.json

USER appuser

EXPOSE 3001

CMD ["node", "dist/main.js"]