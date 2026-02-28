# Vercel Deployment Guide

## Overview

This monorepo contains:
- **Frontend**: Next.js 15.4.2 application in `frontend/`
- **Backend**: NestJS application in `backend/`

Both are configured for deployment on Vercel.

## Backend Deployment

### Prerequisites

1. PostgreSQL database (e.g., Supabase, Neon, or Vercel Postgres)
2. Environment variables configured in Vercel dashboard

### Required Environment Variables

Set these in Vercel project settings for the backend:

```
DATABASE_URL=postgresql://...
DATABASE_DIRECT_URL=postgresql://...
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://yourdomain.com
NODE_ENV=production
PORT=3000
```

Additional variables as needed:
- AWS S3 credentials (if using file uploads)
- Supabase credentials
- JWT secrets
- Other service API keys

### Build Configuration

The backend uses:
- **Build Command**: `yarn install && yarn prisma generate && yarn build`
- **Output Directory**: `dist/`
- **Install Command**: `yarn install`

### Deployment Notes

- The backend is configured as a serverless function via `backend/api/index.ts`
- Prisma Client is generated during build
- WebSocket (Socket.IO) functionality is **not available** in serverless functions
  - Consider using Vercel Edge Functions or an external WebSocket service if needed

## Frontend Deployment

### Prerequisites

1. Backend URL (from backend deployment)
2. Environment variables configured in Vercel dashboard

### Required Environment Variables

Set these in Vercel project settings for the frontend:

```
# Backend API URL
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
# OR if using same domain: /api

# Backend URL for server-side proxy
BACKEND_URL=https://your-backend.vercel.app

# WebSocket URL (if using separate WebSocket service)
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-websocket-service.com

# Root domain for subdomain routing
NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com

# API endpoint paths (relative)
NEXT_PUBLIC_AUTH=/auth
NEXT_PUBLIC_CATEGORY=/category
NEXT_PUBLIC_DISH=/dish
NEXT_PUBLIC_ORDER=/order
NEXT_PUBLIC_TABLE=/table
NEXT_PUBLIC_USER=/user
NEXT_PUBLIC_COMPANY=/company

# External services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build Configuration

The frontend uses:
- **Build Command**: `bun run build`
- **Output Directory**: `.next/`
- **Install Command**: `bun install`

### Deployment Notes

- Next.js is automatically detected by Vercel
- API proxy routes in `src/app/api/[...path]/route.ts` forward requests to backend
- Ensure `BACKEND_URL` points to your deployed backend

## Deployment Steps

### 1. Deploy Backend

1. Create a new Vercel project from the `backend/` directory
2. Configure environment variables
3. Set build command: `yarn install && yarn prisma generate && yarn build`
4. Deploy

### 2. Deploy Frontend

1. Create a new Vercel project from the `frontend/` directory
2. Configure environment variables (use backend URL from step 1)
3. Deploy

### 3. Update CORS

After both are deployed:
1. Update `ALLOWED_ORIGINS` in backend to include frontend URL
2. Redeploy backend if needed

## Monorepo Deployment (Alternative)

If deploying as a monorepo:

1. Configure `vercel.json` at root with both projects
2. Use Vercel's monorepo support
3. Set root directory for each project in Vercel dashboard

## Troubleshooting

### Backend Issues

- **Prisma errors**: Ensure `DATABASE_URL` and `DATABASE_DIRECT_URL` are set correctly
- **CORS errors**: Check `ALLOWED_ORIGINS` includes frontend URL
- **Build failures**: Verify all dependencies are in `package.json`

### Frontend Issues

- **API connection errors**: Verify `NEXT_PUBLIC_API_URL` and `BACKEND_URL` are correct
- **Environment variables**: Ensure all `NEXT_PUBLIC_*` variables are set (they're exposed to client)

## Important Notes

- WebSocket functionality requires a separate service (not available in serverless functions)
- Database migrations should be run manually or via CI/CD before deployment
- Static file serving from backend is disabled in serverless mode
- Ensure database connection pooling is configured for serverless environments
