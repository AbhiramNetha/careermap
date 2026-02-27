# ─────────────────────────────────────────────
#  CareerMap India — Backend
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

# Expose the Express port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
