# ─────────────────────────────────────────────────────────────
# Stage 1: builder — install deps & compile TypeScript
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy backend manifests first to leverage Docker layer cache
COPY src/backend/package*.json src/backend/.npmrc ./

RUN npm ci --ignore-scripts

# Copy backend source and compile
COPY src/backend/ .
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 2: runtime — lean production image
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Install only production dependencies
COPY src/backend/package*.json src/backend/.npmrc ./
RUN npm ci --omit=dev --ignore-scripts

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Copy frontend static files into public/ so ServeStaticModule can serve them
COPY UI_prototype/ ./public/

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/main"]
