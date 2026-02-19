## Description

REST API backend for Resto-hub restaurant management system built with [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/), using [Supabase](https://supabase.com/) as the PostgreSQL database provider.

## Prerequisites

* Node.js v18+
* Yarn
* Supabase account and project
* AWS S3 bucket for file uploads

## Getting Started

### 1. Install dependencies

```bash
yarn install
```

### 2. Set up Supabase

1. Create a new project at [Supabase](https://supabase.com/)
2. Go to Project Settings → Database
3. Copy the connection strings:
   - **Connection pooling** (for application): Use this for `DATABASE_URL`
   - **Direct connection** (for migrations): Use this for `DATABASE_DIRECT_URL`

### 3. Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
# Supabase Database URLs
# Connection pooling URL (for application queries)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
# Direct connection URL (for migrations)
DATABASE_DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Application settings
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://lvh.me:3001

# JWT Configuration
JWT_TOKEN_SECRET=your_jwt_access_secret
JWT_REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

DOMAIN=localhost

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

> ⚠️ **Important:** Replace `[PROJECT_REF]`, `[PASSWORD]`, `[REGION]` with your actual Supabase project credentials. Never commit `.env` files to version control.

### 4. Generate Prisma client

```bash
yarn prisma generate
```

### 5. Run database migrations

```bash
# For development (creates migration files)
yarn prisma migrate dev

# For production (applies existing migrations)
yarn prisma migrate deploy
```

### 6. Start the development server

```bash
yarn start:dev
```

The API will be available at: `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api/docs#/`

## Running Tests

### Test Environment Setup

Create a `.env.test` file for test configuration:

```env
# Use a separate Supabase project for tests OR a test database
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DATABASE_DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
NODE_ENV=test
```

### Run Tests

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

> **Note:** It's recommended to use a separate Supabase project for testing or ensure your test database is properly isolated.

## Supabase Connection Notes

- **Connection Pooling:** Supabase uses pgbouncer for connection pooling. The `DATABASE_URL` with `?pgbouncer=true` is used for application queries to optimize performance.
- **Migrations:** Prisma migrations require a direct connection (without pgbouncer), which is why `DATABASE_DIRECT_URL` is used in the schema.
- **Connection Limits:** Be aware of Supabase connection limits based on your plan. Connection pooling helps manage this efficiently.

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── src/
│   ├── api/               # API modules (auth, category, dish, order, etc.)
│   ├── common/            # Shared utilities, guards, filters
│   └── ...
└── test/                  # E2E tests
```

## License

This project is licensed under the MIT License.
