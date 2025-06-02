import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { AppModule } from 'app.module';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from 'prisma/prisma.service';
import * as request from 'supertest';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: any;
  let authToken: string;

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: Role.WAITER,
  };

  async function cleanupUserAndRelatedData(
    prismaInstance: PrismaService,
    userEmail: string,
  ) {
    const user = await prismaInstance.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        waiterOrders: { select: { id: true } },
        cookOrders: { select: { id: true } },
      },
    });

    if (user) {
      const orderIdsFromWaiter = user.waiterOrders.map((o) => o.id);
      const orderIdsFromCook = user.cookOrders
        ? user.cookOrders.map((o) => o.id)
        : [];

      const allAssociatedOrderIds = [
        ...new Set([...orderIdsFromWaiter, ...orderIdsFromCook]),
      ];

      if (allAssociatedOrderIds.length > 0) {
        await prismaInstance.orderItem.deleteMany({
          where: { orderId: { in: allAssociatedOrderIds } },
        });

        await prismaInstance.order.deleteMany({
          where: { id: { in: allAssociatedOrderIds } },
        });
      }

      await prismaInstance.user.deleteMany({
        where: { email: userEmail },
      });
    } else {
      await prismaInstance.user.deleteMany({
        where: { email: userEmail },
      });
    }
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(cookieParser());

    prisma = app.get(PrismaService);
    await app.init();
    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await cleanupUserAndRelatedData(prisma, testUser.email);
    await request(server).post('/auth/register').send(testUser).expect(201);
    const loginRes = await request(server)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);
    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await cleanupUserAndRelatedData(prisma, testUser.email);
    await cleanupUserAndRelatedData(prisma, 'new@example.com');
    await app.close();
  });

  it('/auth/register (POST) - success', async () => {
    await cleanupUserAndRelatedData(prisma, 'new@example.com');
    const newUser = { ...testUser, email: 'new@example.com' };
    const response = await request(server)
      .post('/auth/register')
      .send(newUser)
      .expect(201);
    expect(response.body).toHaveProperty('access_token');
  });

  it('/auth/register (POST) - conflict', async () => {
    const response = await request(server)
      .post('/auth/register')
      .send(testUser)
      .expect(409);
    expect(response.body.message).toBe('Email already in use');
  });

  it('/auth/login (POST) - success', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);
    expect(response.body).toHaveProperty('token');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('/auth/login (POST) - unauthorized', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: 'invalidpassword' })
      .expect(401);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('/auth/refresh (POST) - success', async () => {
    const loginResponse = await request(server)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);
    const cookies = loginResponse.headers['set-cookie'];
    const response = await request(server)
      .post('/auth/refresh')
      .set('Cookie', cookies)
      .expect(200);
    expect(response.body).toHaveProperty('token');
  });

  it('/auth/logout (POST) - should log out successfully', async () => {
    const logoutRes = await request(server)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    expect(logoutRes.body).toEqual({ message: 'Logged out successfully' });
    const setCookieHeader = logoutRes.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
  });
});
