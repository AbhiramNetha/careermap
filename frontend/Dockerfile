# ─────────────────────────────────────────────
#  CareerMap India — Frontend
#  Node 20 LTS on Alpine (small image)
# ─────────────────────────────────────────────

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy source (only used for production builds;
# in dev the directory is bind-mounted over this)
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# --host binds Vite to 0.0.0.0 so Docker can forward the port
CMD ["npm", "run", "dev", "--", "--host"]
