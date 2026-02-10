FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Build the web version
RUN npm run build:web

# Expose port (default 3000, Render will override)
EXPOSE 3000

# Start serving the build with PORT support for Render
CMD ["sh", "-c", "npx serve -s dist -l ${PORT:-3000}"]
