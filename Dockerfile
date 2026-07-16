# Runtime dependencies only. This is a clean install rather than a prune of the builder's tree,
# because `bun install --production` skips devDependencies but never removes ones already on disk.
# The toolchain is needed even here: @discordjs/opus ships no prebuild for this ABI and compiles
# from source, which is also why this cannot be deferred to the runner stage.
FROM oven/bun:1-slim AS deps

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Full dependencies, used only to type check.
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

COPY tsconfig.json ./
COPY src ./src

# Run type check
RUN bunx tsc --noEmit

# Run stage (keep image lightweight)
FROM oven/bun:1-slim AS runner

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
# tsconfig.json ships with the app: Bun reads its `paths` to resolve the @/ alias at runtime.
COPY package.json tsconfig.json ./
COPY src ./src

ENV NODE_ENV=production

CMD ["bun", "run", "src/index.ts"]
