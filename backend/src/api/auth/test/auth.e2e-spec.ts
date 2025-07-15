import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import { PrismaService } from 'prisma/prisma.service';
import { company_avatar, folder_avatar } from 'src/common/constants';
import { CompanyContextMiddleware } from 'src/common/middleware/company-context.middleware';
import { S3Service } from 'src/common/s3/s3.service';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: any;
  let s3Service: S3Service;

  const companyData = {
    name: 'TestCompany',
    subdomain: 'testcompany',
    address: '123 Main St',
    latitude: 50.45,
    longitude: 30.5234,
    adminName: 'Test Admin',
    adminEmail: 'admin@example.com',
    adminPassword: 'password123',
  };

  const loginDto = {
    email: companyData.adminEmail,
    password: companyData.adminPassword,
  };
  const hostHeaderWithSubdomain = `${companyData.subdomain}.localhost`;
  const hostHeaderWithoutSubdomain = 'localhost';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(cookieParser());

    prisma = app.get(PrismaService);
    s3Service = app.get(S3Service);

    const middleware = new CompanyContextMiddleware(prisma);
    app.use(middleware.use.bind(middleware));

    await app.init();
    server = app.getHttpServer();

    await request(server)
      .post('/api/auth/register-company')
      .set('Host', hostHeaderWithoutSubdomain)
      .field('name', companyData.name)
      .field('subdomain', companyData.subdomain)
      .field('address', companyData.address)
      .field('latitude', companyData.latitude.toString())
      .field('longitude', companyData.longitude.toString())
      .field('adminName', companyData.adminName)
      .field('adminEmail', companyData.adminEmail)
      .field('adminPassword', companyData.adminPassword)
      .attach('logoUrl', path.join(__dirname, 'fixtures', 'logo.jpg'))
      .attach('avatarUrl', path.join(__dirname, 'fixtures', 'avatar.webp'))
      .expect(201);
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
    await s3Service.deleteFolder(folder_avatar);
    await s3Service.deleteFolder(company_avatar);
    await app.close();
  });

  describe('/api/auth/register-company (POST)', () => {
    it('should return 409 if email is already in use', async () => {
      await request(server)
        .post('/api/auth/register-company')
        .set('Host', hostHeaderWithoutSubdomain)
        .field('name', 'AnotherCo')
        .field('subdomain', 'anotherco')
        .field('address', '456 Street')
        .field('latitude', '50')
        .field('longitude', '30')
        .field('adminName', 'Admin 2')
        .field('adminEmail', companyData.adminEmail)
        .field('adminPassword', 'password456')
        .attach('logoUrl', path.join(__dirname, 'fixtures', 'logo.jpg'))
        .attach('avatarUrl', path.join(__dirname, 'fixtures', 'avatar.webp'))
        .expect(409);
    });

    it('should return 409 if subdomain or name already exists', async () => {
      await request(server)
        .post('/api/auth/register-company')
        .set('Host', hostHeaderWithoutSubdomain)
        .field('name', companyData.name)
        .field('subdomain', companyData.subdomain)
        .field('address', '123 Main St')
        .field('latitude', '50.45')
        .field('longitude', '30.5234')
        .field('adminName', 'Admin')
        .field('adminEmail', 'another@example.com')
        .field('adminPassword', 'password')
        .attach('logoUrl', path.join(__dirname, 'fixtures', 'logo.jpg'))
        .attach('avatarUrl', path.join(__dirname, 'fixtures', 'avatar.webp'))
        .expect(409);
    });

    it('should return 400 if files are missing', async () => {
      await request(server)
        .post('/api/auth/register-company')
        .set('Host', hostHeaderWithoutSubdomain)
        .field('name', 'NewCo')
        .field('subdomain', 'newco')
        .field('address', 'New Address')
        .field('latitude', '50.5')
        .field('longitude', '30.5')
        .field('adminName', 'Admin')
        .field('adminEmail', 'new@example.com')
        .field('adminPassword', 'password')
        .expect(400);
    });
  });

  describe('/api/auth/login (POST)', () => {
    it('should login successfully', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .set('Host', hostHeaderWithSubdomain)
        .send(loginDto)
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should fail login with wrong credentials', async () => {
      await request(server)
        .post('/api/auth/login')
        .set('Host', hostHeaderWithSubdomain)
        .send({ email: loginDto.email, password: 'wrongpass' })
        .expect(401);
    });

    it('should return 401 if company subdomain is missing', async () => {
      await request(server)
        .post('/api/auth/login')
        .set('Host', hostHeaderWithoutSubdomain)
        .send(loginDto)
        .expect(401);
    });
  });

  describe('/api/auth/refresh (POST)', () => {
    it('should refresh token using cookies', async () => {
      const loginRes = await request(server)
        .post('/api/auth/login')
        .set('Host', hostHeaderWithSubdomain)
        .send(loginDto)
        .expect(200);

      const cookies = loginRes.headers['set-cookie'];

      const refreshRes = await request(server)
        .post('/api/auth/refresh')
        .set('Host', hostHeaderWithSubdomain)
        .set('Cookie', cookies)
        .expect(200);

      expect(refreshRes.body).toHaveProperty('token');
    });

    it('should return 401 if no refresh token', async () => {
      await request(server)
        .post('/api/auth/refresh')
        .set('Host', hostHeaderWithSubdomain)
        .expect(401);
    });

    it('should return 401 for invalid refresh token', async () => {
      await request(server)
        .post('/api/auth/refresh')
        .set('Host', hostHeaderWithSubdomain)
        .set('Cookie', 'jid=invalidtoken')
        .expect(401);
    });
  });

  describe('/api/auth/logout (POST)', () => {
    it('should logout and clear cookie', async () => {
      const loginRes = await request(server)
        .post('/api/auth/login')
        .set('Host', hostHeaderWithSubdomain)
        .send(loginDto)
        .expect(200);

      const token = loginRes.body.token;

      const resLogout = await request(server)
        .post('/api/auth/logout')
        .set('Host', hostHeaderWithSubdomain)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(resLogout.body.message).toBe('Logged out successfully');
      expect(resLogout.headers['set-cookie']).toBeDefined();
    });
  });
});
