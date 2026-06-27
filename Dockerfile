# ─────────────────────────────────────────────────────────────
#  Root-level Dockerfile — Way2Fresher Backend
#  Used when Render's Docker Web Service points at repo root.
#  Build context is the repo root; source is in ./backend
# ─────────────────────────────────────────────────────────────

FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy backend package files first (better layer caching)
COPY backend/package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy the entire backend source
COPY backend/ .

# Expose the Express port
EXPOSE 5000

# Health check so Render knows when the service is ready
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Start the server
CMD ["node", "server.js"]
