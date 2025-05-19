import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from 'prisma/prisma.service';
import * as request from 'supertest';

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
    role: 'ADMIN',
  };

  const userCredentials = {
    name: 'Test User Cat',
    email: 'usercat@example.com',
    password: 'usercatpass123',
    role: 'WAITER',
  };

  const categoryData = {
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

    await prisma.user.deleteMany({
      where: { email: { in: [adminCredentials.email, userCredentials.email] } },
    });
    await prisma.category.deleteMany();

    await app.init();
    server = app.getHttpServer();

    await request(server)
      .post('/auth/register')
      .send(adminCredentials)
      .expect(201);
    const adminLoginRes = await request(server)
      .post('/auth/login')
      .send({
        email: adminCredentials.email,
        password: adminCredentials.password,
      })
      .expect(200);
    adminToken = adminLoginRes.body.token;
    expect(adminToken).toBeDefined();

    await request(server)
      .post('/auth/register')
      .send(userCredentials)
      .expect(201);
    const userLoginRes = await request(server)
      .post('/auth/login')
      .send({
        email: userCredentials.email,
        password: userCredentials.password,
      })
      .expect(200);
    userToken = userLoginRes.body.token;
    expect(userToken).toBeDefined();
  });

  beforeEach(async () => {
    await prisma.category.deleteMany();
    const res = await request(server)
      .post('/category/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(categoryData);
    if (res.status === 201) {
      categoryId = res.body.id;
    }
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [adminCredentials.email, userCredentials.email] } },
    });
    await prisma.category.deleteMany();
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
      await request(server)
        .post('/category/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createCategoryDto)
        .expect(201);

      const res = await request(server)
        .post('/category/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createCategoryDto)
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

  describe('GET /category', () => {
    it('should get all categories', async () => {
      const res = await request(server)
        .get('/category')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body.some((cat) => cat.name === categoryData.name)).toBe(true);
    });

    it('should return an empty array if no categories exist', async () => {
      await prisma.category.deleteMany();
      const res = await request(server)
        .get('/category')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
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
      expect(res.body.name).toBe(categoryData.name);
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
      const secondCategoryDto = { name: 'Another Unique Category' };
      const secondCatRes = await request(server)
        .post('/category/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(secondCategoryDto)
        .expect(201);
      const secondCategoryId = secondCatRes.body.id;

      await request(server)
        .patch(`/category/${secondCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: categoryData.name })
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
