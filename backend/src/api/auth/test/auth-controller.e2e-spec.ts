import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from 'prisma/prisma.service';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: any;

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'WAITER',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(cookieParser());

    prisma = app.get(PrismaService);

    await prisma.user.deleteMany();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  it('/auth/register (POST) - success', async () => {
    const response = await request(server)
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body.user).toMatchObject({
      email: testUser.email,
      name: testUser.name,
      role: testUser.role,
    });
  });

  it('/auth/register (POST) - conflict', async () => {
    await request(server).post('/auth/register').send(testUser);

    const response = await request(server)
      .post('/auth/register')
      .send(testUser)
      .expect(409);

    expect(response.body.message).toBe('Email already in use');
  });

  it('/auth/login (POST) - success', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('/auth/login (POST) - unauthorized', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({
        email: 'wrong@email.com',
        password: 'invalidpassword',
      })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
  });

  it('/auth/refresh (POST) - success', async () => {
    const loginResponse = await request(server)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    const cookies = loginResponse.headers['set-cookie'];
    expect(cookies).toBeDefined();
    console.log('Cookies for refresh:', cookies);

    const response = await request(server)
      .post('/auth/refresh')
      .set('Cookie', cookies)
      .expect(200);

    expect(response.body).toHaveProperty('token');
  });

  it('/auth/logout (POST)', async () => {
    const loginRes = await request(server)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const token = loginRes.body.token;
    const cookies = loginRes.headers['set-cookie'];

    const logoutRes = await request(server)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(logoutRes.body).toEqual({ message: 'Logged out successfully' });

    const setCookieHeader = logoutRes.headers['set-cookie'];
    if (Array.isArray(setCookieHeader)) {
      expect(setCookieHeader.some((cookie) => cookie.startsWith('jid=;'))).toBe(
        true,
      );
    } else if (typeof setCookieHeader === 'string') {
      expect(setCookieHeader.startsWith('jid=;')).toBe(true);
    } else {
      fail('Expected Set-Cookie header to be present for jid deletion.');
    }
  });
});
