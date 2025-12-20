# Stage 1: Build the application
# Docker Hub Rate Limit 회피를 위해 Public ECR의 Node 이미지 사용
FROM public.ecr.aws/docker/library/node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM public.ecr.aws/docker/library/node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built artifacts from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Set user
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
