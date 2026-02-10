FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Expose Expo port
EXPOSE 8081 19000

# Start Expo
CMD ["npm", "start"]
