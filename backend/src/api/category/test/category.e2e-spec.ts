import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from 'prisma/prisma.service';
import * as request from 'supertest';
import { getAuthToken } from 'test/utils/auth-test';

describe('Category (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;
  let categoryId: number;
  const nonExistingId = 999999;

  const adminCredentials = {
    name: 'Test Admin Cat',
    email: 'admincat@example.com',
    password: 'admincatpass123',
    role: 'ADMIN' as any,
  };

  const userCredentials = {
    name: 'Test User Cat',
    email: 'usercat@example.com',
    password: 'usercatpass123',
    role: 'WAITER' as any,
  };

  const initialCategoryData = {
    name: 'Initial Test Category',
  };

  const createCategoryDto = {
    name: 'Test Category E2E',
  };

  const createCategoryDtoInvalid = {
    name: '',
  };

  const updateCategoryDto = {
    name: 'Updated Test Category E2E',
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
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.use(cookieParser());
    prisma = app.get(PrismaService);

    await cleanupUserAndRelatedData(prisma, adminCredentials.email);
    await cleanupUserAndRelatedData(prisma, userCredentials.email);

    await app.init();
    server = app.getHttpServer();

    adminToken = await getAuthToken(app, adminCredentials);
    if (!adminToken) throw new Error('Admin token not received');

    userToken = await getAuthToken(app, userCredentials);
    if (!userToken) throw new Error('User token not received');
  });

  beforeEach(async () => {
    await prisma.category.deleteMany();
    const res = await request(server)
      .post('/category/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(initialCategoryData);

    if (res.status !== 201) {
      console.error(
        'Failed to create initial category in beforeEach for Category tests:',
        res.status,
        res.body,
      );
      throw new Error('Failed to create initial category in beforeEach');
    }
    categoryId = res.body.id;
    if (!categoryId) {
      throw new Error(
        'Initial category ID is undefined after creation in beforeEach',
      );
    }
  });

  afterAll(async () => {
    await cleanupUserAndRelatedData(prisma, adminCredentials.email);
    await cleanupUserAndRelatedData(prisma, userCredentials.email);
    await app.close();
  });

  describe('POST /category/create', () => {
    it('should create a new category for ADMIN', async () => {
      const res = await request(server)
        .post('/category/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createCategoryDto)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(createCategoryDto.name);

      const dbCategory = await prisma.category.findUnique({
        where: { id: res.body.id },
      });
      expect(dbCategory).not.toBeNull();
      expect(dbCategory?.name).toBe(createCategoryDto.name);
    });

    it('should return 409 Conflict when creating a category with an existing name', async () => {
      const res = await request(server)
        .post('/category/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(initialCategoryData)
        .expect(409);

      expect(res.body.message).toContain(
        'Record with this unique constraint already exists. Details: name',
      );
    });

    it('should return 400 Bad Request for invalid data (e.g., empty name)', async () => {
      const res = await request(server)
        .post('/category/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createCategoryDtoInvalid)
        .expect(400);

      expect(res.body.message).toBeInstanceOf(Array);
      expect(res.body.message[0]).toContain(
        'name must be longer than or equal to 3 characters',
      );
    });

    it('should return 403 Forbidden for non-ADMIN role', async () => {
      await request(server)
        .post('/category/create')
        .set('Authorization', `Bearer ${userToken}`)
        .send(createCategoryDto)
        .expect(403);
    });

    it('should return 401 Unauthorized without token', async () => {
      await request(server)
        .post('/category/create')
        .send(createCategoryDto)
        .expect(401);
    });
  });

  describe('GET /category/:id', () => {
    it('should get a category by ID', async () => {
      expect(categoryId).toBeDefined();
      const res = await request(server)
        .get(`/category/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.id).toBe(categoryId);
      expect(res.body.name).toBe(initialCategoryData.name);
    });

    it('should return 404 for non-existing category ID', async () => {
      await request(server)
        .get(`/category/${nonExistingId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(server)
        .get(`/category/abc`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.message).toContain(
        'Validation failed (numeric string is expected)',
      );
    });
  });

  describe('PATCH /category/:id', () => {
    it('should update a category for ADMIN', async () => {
      expect(categoryId).toBeDefined();
      const res = await request(server)
        .patch(`/category/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateCategoryDto)
        .expect(200);

      expect(res.body.id).toBe(categoryId);
      expect(res.body.name).toBe(updateCategoryDto.name);

      const dbCategory = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      expect(dbCategory?.name).toBe(updateCategoryDto.name);
    });

    it('should return 404 when trying to update a non-existing category', async () => {
      await request(server)
        .patch(`/category/${nonExistingId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateCategoryDto)
        .expect(404);
    });

    it('should return 400 Bad Request for invalid update data', async () => {
      expect(categoryId).toBeDefined();
      await request(server)
        .patch(`/category/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createCategoryDtoInvalid)
        .expect(400);
    });

    it('should return 403 Forbidden for USER role trying to update', async () => {
      expect(categoryId).toBeDefined();
      await request(server)
        .patch(`/category/${categoryId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateCategoryDto)
        .expect(403);
    });

    it('should return 401 Unauthorized without token trying to update', async () => {
      expect(categoryId).toBeDefined();
      await request(server)
        .patch(`/category/${categoryId}`)
        .send(updateCategoryDto)
        .expect(401);
    });

    it('should return 409 Conflict when updating name to an already existing name', async () => {
      const secondCategoryDto = {
        name: 'Another Unique Category for Patch Test',
      };
      const secondCatRes = await request(server)
        .post('/category/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(secondCategoryDto)
        .expect(201);
      const secondCategoryId = secondCatRes.body.id;

      await request(server)
        .patch(`/category/${secondCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: initialCategoryData.name })
        .expect(409);
    });
  });

  describe('DELETE /category/:id', () => {
    it('should delete a category for ADMIN', async () => {
      expect(categoryId).toBeDefined();
      await request(server)
        .delete(`/category/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const dbCategory = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      expect(dbCategory).toBeNull();
    });

    it('should return 404 when trying to delete a non-existing category', async () => {
      await request(server)
        .delete(`/category/${nonExistingId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should return 403 Forbidden for USER role trying to delete', async () => {
      expect(categoryId).toBeDefined();
      await request(server)
        .delete(`/category/${categoryId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 401 Unauthorized without token trying to delete', async () => {
      expect(categoryId).toBeDefined();
      await request(server).delete(`/category/${categoryId}`).expect(401);
    });
  });
});
