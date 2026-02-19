# Resto-hub — Restaurant Management System

**Resto-hub** is a restaurant and cafe management system consisting of a backend API and a frontend interface.
This repository contains both parts of the application:

- `backend/` — REST API built with [NestJS](https://nestjs.com/)
- `frontend/` — (pending) Web client (to be documented later)

## Backend Setup

## Prerequisites

* Node.js v18+
* Yarn
* Supabase account and project (for PostgreSQL database)
* AWS S3 bucket for file uploads

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kashubyak/Resto-hub.git
cd Resto-hub
```

### 2. Install dependencies

```bash
cd backend
yarn install
```

### 3. Set up Supabase

1. Create a new project at [Supabase](https://supabase.com/)
2. Go to Project Settings → Database
3. Copy the connection strings:
   - **Connection pooling** (for application): Use this for `DATABASE_URL`
   - **Direct connection** (for migrations): Use this for `DATABASE_DIRECT_URL`

### 4. Configure environment variables

Create the following environment files inside the `backend/` directory.

#### `.env`

```env
# Supabase Database URLs
# Connection pooling URL (for application queries)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
# Direct connection URL (for migrations)
DATABASE_DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3001

JWT_TOKEN_SECRET=your_jwt_access_secret
JWT_REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

DOMAIN=localhost

AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

#### `.env.test`

```env
# Use a separate Supabase project for tests OR a test database
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DATABASE_DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
NODE_ENV=test
```

> ⚠️ **Important:**
> - Replace `[PROJECT_REF]`, `[PASSWORD]`, `[REGION]` with your actual Supabase project credentials
> - Get connection strings from Supabase Dashboard → Project Settings → Database
> - Never commit `.env` files to version control

### 5. Generate Prisma client

```bash
yarn prisma generate
```

### 6. Run database migrations

```bash
# For development (creates migration files)
yarn prisma migrate dev

# For production (applies existing migrations)
yarn prisma migrate deploy
```

### 7. Start the development server

```bash
yarn start:dev
```

The API will be available at: `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api/docs#/`

### Local development with subdomains

The app uses subdomains for company context (e.g. `mycompany.localhost`). For login and all company-scoped features to work locally:

1. Add your company subdomain to `/etc/hosts`:
   ```
   127.0.0.1 mycompany.localhost
   ```
   Replace `mycompany` with your actual subdomain from registration.

2. Include the subdomain origin in `ALLOWED_ORIGINS` in backend `.env`:
   ```
   ALLOWED_ORIGINS=http://localhost:3001,http://mycompany.localhost:3001
   ```

3. Open the app at `http://mycompany.localhost:3001` instead of `http://localhost:3001`.

**Alternative (shared cookies):** Browsers reject cookies with `domain=.localhost`. For subdomain cookies in dev, use **lvh.me**: set `NEXT_PUBLIC_ROOT_DOMAIN=lvh.me` in frontend `.env.development`, open `http://lvh.me:3001` and company dashboards at `http://<subdomain>.lvh.me:3001`. Add `http://lvh.me:3001` to backend `ALLOWED_ORIGINS`; backend CORS allows `*.lvh.me` in development.

## Deploy (Vercel)

For production on **Vercel**, use **one origin**: deploy the Next.js frontend on Vercel and serve the API on the same domain (e.g. `/api/*` via Vercel rewrites to your backend). Then set `NEXT_PUBLIC_API_URL` to that same domain (e.g. `https://yourapp.vercel.app/api` or relative `/api`). Cookies and CORS stay same-origin. If the backend runs on a different host, cookie-based auth across origins will not work; use a token-in-header scheme instead.

## Running Tests

To run end-to-end (e2e) tests:

```bash
yarn test:e2e
```

> It is recommended to run individual test files when needed, for example:

```bash
yarn test:e2e src/api/dish/test/order.e2e-spec.ts
```

Make sure the test database is created and configured in `.env.test`.

## Frontend Setup
The frontend is located in the frontend/ directory.

Setup instructions will be added soon.

---

## License

This project is licensed under the MIT License.
