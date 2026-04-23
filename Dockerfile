FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci
# Rebuild sharp for the current architecture (Alpine Linux)
RUN npm install --os=linux --cpu=x64 sharp

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy data directory for persistence (includes db.json)
COPY --from=builder --chown=nextjs:nodejs /app/src/data ./src/data
# Ensure db.json exists and has correct permissions
RUN mkdir -p src/data && \
    if [ ! -f ./src/data/db.json ]; then echo '{"sessions":[]}' > ./src/data/db.json; fi && \
    chown -R nextjs:nodejs src/data

# Create uploads directory with correct permissions
RUN mkdir -p public/uploads && chown -R nextjs:nodejs public/uploads

# Copy plutonium data directory (moved to end to ensure it's not overwritten)
COPY --from=builder --chown=nextjs:nodejs /app/plutonium ./plutonium

# Final check to verify files exist in the runner stage
RUN ls -d /app/plutonium/data && echo "Verification: Plutonium data is present"

# USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
