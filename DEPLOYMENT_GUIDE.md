# Frontend Deployment Guide - Render.com

## Problem Fixed
The original Dockerfile was trying to run `expo start` in a Docker container, which was causing a permission denied error during deployment on Render.com. The `expo start` command is designed for development, not production.

## Solution Implemented

### 1. Updated Dockerfile (frontend/Dockerfile)
Changed the deployment strategy to:
- Build the Expo web app with `npx expo export --platform web` 
- Serve the static build using `serve` package
- Support Render's PORT environment variable

**Key Changes:**
```dockerfile
# Install serve for static file serving
RUN npm install -g serve

# Build during container build
RUN npx expo export --platform web

# Serve with PORT support for Render
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
```

### 2. Added serve Package (frontend/package.json)
Added `serve` to devDependencies to ensure it's available in production builds.

### 3. Added Build Scripts (frontend/package.json)
New npm scripts for easier building and serving:
- `npm run build:web` - Build for web
- `npm run serve` - Serve the dist folder (local development)
- `npm run serve:prod` - Serve on port 3000 (production-like)
- `npm run deploy` - Build and serve (one command)

### 4. Created render.yaml
Blueprint config file for deploying all services to Render with proper environment variables.

## Environment Variables
The frontend uses `EXPO_PUBLIC_API_URL` for the backend API URL:
- Currently set in `.env` file: `https://event-compass-backend.onrender.com/api`
- Available during build time (Expo reads it at build time)

## How to Deploy to Render

### Option 1: Using render.yaml
If deploying multiple services (frontend, admin, backend):
```bash
# Push the render.yaml to your repository
git add render.yaml
git commit -m "Add Render.yaml for multi-service deployment"
git push

# On Render.com dashboard: Create from Blueprint
# Select the repository and let it auto-detect render.yaml
```

### Option 2: Manual Frontend Deployment
1. Go to Render.com dashboard
2. Create new "Web Service"
3. Connect your GitHub repository
4. Set Build Command: `npm install && npm run build:web`
5. Set Start Command: `serve -s dist -l $PORT`
6. Add environment variable:
   - Key: `EXPO_PUBLIC_API_URL`
   - Value: `https://event-compass-backend.onrender.com/api`
7. Deploy

## Testing Locally

### Build and Test Web Version
```bash
cd frontend
npm run build:web   # Creates dist folder
npm run serve       # Serves on port 3000
```

Then visit `http://localhost:3000` in your browser.

## Troubleshooting

### Build fails with "expo export" error
- Ensure all dependencies are installed: `npm install`
- Check that Node.js version is compatible (18+ recommended)
- Try building locally first: `npm run build:web`

### Port already in use
- Change the port in serve command: `serve -s dist -l 5000`
- Or kill the process using port 3000

### Backend connection issues
- Verify `EXPO_PUBLIC_API_URL` is set correctly in `.env`
- Check that backend API is responding: `https://event-compass-backend.onrender.com/api`
- Ensure CORS is configured on backend to accept requests from frontend domain

## Summary
The frontend is now properly configured for production deployment:
- ✅ Static web build generated during Docker build
- ✅ Proper port binding for Render environments
- ✅ Environment variable support for backend URL
- ✅ Lightweight `serve` package for HTTP serving
- ✅ Build scripts for local testing and deployment
