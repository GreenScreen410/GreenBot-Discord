FROM oven/bun:1-slim AS builder

# Install build dependencies for native modules (like @discordjs/opus)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first (for layer caching)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Run type check
RUN bunx tsc --noEmit

# Run stage (keep image lightweight)
FROM oven/bun:1-slim AS runner

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app ./

ENV NODE_ENV=production

CMD ["bun", "run", "src/index.ts"]
