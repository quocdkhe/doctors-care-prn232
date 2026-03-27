# Updated to Node 22 (LTS) for better performance and security
FROM node:22-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
# libc6-compat is still recommended for alpine to handle shared library dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install
# 2. Prepare the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# No build at image creation time. Build will happen at startup.

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Install curl for health checking the backend
RUN apk add --no-cache curl

ENV NODE_ENV production
ENV PORT 3000

# Copy all source files and node_modules for runtime build
COPY --from=builder /app ./

EXPOSE 3000

# Default command if not overridden by docker-compose
CMD ["npm", "start"]