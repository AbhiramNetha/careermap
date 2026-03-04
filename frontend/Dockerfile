# ─────────────────────────────────────────────
#  CareerMap India — Frontend (Production)
#  Stage 1: Build the React app with Vite
#  Stage 2: Serve the static files via nginx
# ─────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (better layer caching)
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .

# Accept build-time env vars (Vite bakes these in at build time)
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Stage 2: Serve ────────────────────────────
FROM nginx:alpine

# Copy built static files to nginx's default serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config for React Router (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
