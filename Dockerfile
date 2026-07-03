# Use Node.js 20 LTS as base image
FROM node:20-slim

# Install dependencies for canvas and other potential native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create data directory for sessions
RUN mkdir -p data/sessions

# Expose port (if needed, though Baileys is client-side)
# EXPOSE 3000

# Start the bot
CMD ["npm", "start"]
