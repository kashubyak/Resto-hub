import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from 'prisma/prisma.service';
import { company_avatar, folder_avatar } from 'src/common/constants';
import { CompanyContextMiddleware } from 'src/common/middleware/company-context.middleware';
import { S3Service } from 'src/common/s3/s3.service';
import * as request from 'supertest';
import { BASE_URL, companyData, HOST, localhost } from 'test/utils/constants';
import { cleanTestDb } from 'test/utils/db-utils';
import {
  attachCompanyFormFields,
  baseCompanyFormFields,
} from 'test/utils/form-utils';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: any;
  let s3Service: S3Service;
  const loginDto = {
    email: companyData.adminEmail,
    password: companyData.adminPassword,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(cookieParser());

    prisma = app.get(PrismaService);
    await cleanTestDb(prisma);
    s3Service = app.get(S3Service);

    const middleware = new CompanyContextMiddleware(prisma);
    app.use(middleware.use.bind(middleware));

    await app.init();
    server = app.getHttpServer();

    await attachCompanyFormFields(
      request(server)
        .post(`${BASE_URL.AUTH}/register-company`)
        .set('Host', localhost),
      companyData,
    ).expect(201);
  });

  afterAll(async () => {
    await s3Service.deleteFolder(folder_avatar);
    await s3Service.deleteFolder(company_avatar);
    await app.close();
  });

  describe('${BASE_URL.AUTH}/register-company (POST)', () => {
    it('should return 409 if email is already in use', async () => {
      await attachCompanyFormFields(
        request(server)
          .post(`${BASE_URL.AUTH}/register-company`)
          .set('Host', localhost),
        companyData,
      ).expect(409);
    });

    it('should return 409 if subdomain or name already exists', async () => {
      await attachCompanyFormFields(
        request(server)
          .post(`${BASE_URL.AUTH}/register-company`)
          .set('Host', localhost),
        companyData,
      ).expect(409);
    });

    it('should return 400 if files are missing', async () => {
      await baseCompanyFormFields(
        request(server)
          .post(`${BASE_URL.AUTH}/register-company`)
          .set('Host', localhost),
        companyData,
      ).expect(400);
    });
  });

  describe(`${BASE_URL.AUTH}/login (POST)`, () => {
    it('should login successfully', async () => {
      const res = await request(server)
        .post(`${BASE_URL.AUTH}/login`)
        .set('Host', HOST)
        .send(loginDto)
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should fail login with wrong credentials', async () => {
      await request(server)
        .post(`${BASE_URL.AUTH}/login`)
        .set('Host', HOST)
        .send({ email: loginDto.email, password: 'wrongpass' })
        .expect(401);
    });

    it('should return 401 if company subdomain is missing', async () => {
      await request(server)
        .post(`${BASE_URL.AUTH}/login`)
        .set('Host', localhost)
        .send(loginDto)
        .expect(401);
    });
  });

  describe(`${BASE_URL.AUTH}/refresh (POST)`, () => {
    it('should refresh token using cookies', async () => {
      const loginRes = await request(server)
        .post(`${BASE_URL.AUTH}/login`)
        .set('Host', HOST)
        .send(loginDto)
        .expect(200);

      const cookies = loginRes.headers['set-cookie'];

      const refreshRes = await request(server)
        .post(`${BASE_URL.AUTH}/refresh`)
        .set('Host', HOST)
        .set('Cookie', cookies)
        .expect(200);

      expect(refreshRes.body).toHaveProperty('token');
    });

    it('should return 401 if no refresh token', async () => {
      await request(server)
        .post(`${BASE_URL.AUTH}/refresh`)
        .set('Host', HOST)
        .expect(401);
    });

    it('should return 401 for invalid refresh token', async () => {
      await request(server)
        .post(`${BASE_URL.AUTH}/refresh`)
        .set('Host', HOST)
        .set('Cookie', 'jid=invalidtoken')
        .expect(401);
    });
  });

  describe(`${BASE_URL.AUTH}/logout (POST)`, () => {
    it('should logout and clear cookie', async () => {
      const loginRes = await request(server)
        .post(`${BASE_URL.AUTH}/login`)
        .set('Host', HOST)
        .send(loginDto)
        .expect(200);

      const token = loginRes.body.token;
      const resLogout = await request(server)
        .post(`${BASE_URL.AUTH}/logout`)
        .set('Host', HOST)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(resLogout.body.message).toBe('Logged out successfully');
      expect(resLogout.headers['set-cookie']).toBeDefined();
    });
  });
});
