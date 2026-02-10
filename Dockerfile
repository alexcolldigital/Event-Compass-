FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (using npm install for flexibility with lock file)
RUN npm install --only=prod

# Copy app source
COPY . .

# Build the web version using npx directly
RUN npx --yes expo@latest export --platform web || npx expo export --platform web

# Expose port (default 3000, Render will override)
EXPOSE 3000

# Start serving the build with PORT support for Render
CMD ["sh", "-c", "npx serve -s dist -l ${PORT:-3000}"]
