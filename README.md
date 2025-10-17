# Resto-hub — Restaurant Management System

**Resto-hub** is a restaurant and cafe management system consisting of a backend API and a frontend interface.  
This repository contains both parts of the application:

- `backend/` — REST API built with [NestJS](https://nestjs.com/)
- `frontend/` — (pending) Web client (to be documented later)

## Backend Setup

## Prerequisites

* Node.js v18+
* Yarn
* PostgreSQL
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

### 3. Configure environment variables

Create the following environment files inside the `backend/` directory.

#### `.env`

```env
DATABASE_URL="postgresql://<db_user>:<db_password>@localhost:5432/resto_hub?schema=public"
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
DATABASE_URL="postgresql://<db_user>:<db_password>@localhost:5432/resto_hub_test?schema=public"
NODE_ENV=test
```

> ⚠️ Replace placeholder values (`<...>`) with your actual credentials or use environment-specific secrets in development.

### 4. Generate Prisma client

```bash
yarn prisma generate
```

### 5. Run database migrations

```bash
yarn prisma migrate dev
```

### 6. Start the development server

```bash
yarn start:dev
```

The API will be available at: `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api/docs#/`

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
