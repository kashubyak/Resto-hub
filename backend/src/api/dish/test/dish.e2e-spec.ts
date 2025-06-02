import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from 'prisma/prisma.service';
import * as request from 'supertest';
import { getAuthToken } from 'test/utils/auth-test';

describe('DishController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let prisma: PrismaService;
  let adminToken: string;
  let categoryId: number;
  let newCategoryId: number;
  const nonExistingId = 9999;

  const adminUser = {
    name: 'Admin User Dish',
    email: 'admindish@example.com',
    password: 'admindishpass123',
    role: 'ADMIN' as any,
  };

  const baseDishData = {
    name: 'Base Test Dish',
    description: 'Delicious base dish',
    price: 10.99,
    imageUrl: 'https://example.com/dish.jpg',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    weightGr: 500,
    calories: 600,
    available: true,
  };

  const updatedDishPayload = {
    name: 'Updated Dish Name',
    price: 12.99,
    available: false,
    description: 'Even more delicious!',
    imageUrl: 'https://example.com/updated-dish.jpg',
    ingredients: ['New Ingredient'],
    weightGr: 600,
    calories: 700,
  };

  const categoryDataForDishTests = { name: 'Test Category For Dishes' };
  const newCategoryDataForDishTests = { name: 'New Test Category For Dishes' };

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

    await cleanupUserAndRelatedData(prisma, adminUser.email);

    await app.init();
    server = app.getHttpServer();

    adminToken = await getAuthToken(app, adminUser);
    if (!adminToken) throw new Error('Admin token not received for dish tests');

    const categoryRes = await request(server)
      .post('/category/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(categoryDataForDishTests);
    if (categoryRes.status !== 201) {
      console.error(
        'Failed to create categoryDataForDishTests',
        categoryRes.status,
        categoryRes.body,
      );
      throw new Error('Failed to create categoryDataForDishTests in beforeAll');
    }
    categoryId = categoryRes.body.id;
    if (!categoryId) throw new Error('categoryId is undefined after creation');

    const newCategoryRes = await request(server)
      .post('/category/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newCategoryDataForDishTests);
    if (newCategoryRes.status !== 201) {
      console.error(
        'Failed to create newCategoryDataForDishTests',
        newCategoryRes.status,
        newCategoryRes.body,
      );
      throw new Error(
        'Failed to create newCategoryDataForDishTests in beforeAll',
      );
    }
    newCategoryId = newCategoryRes.body.id;
    if (!newCategoryId)
      throw new Error('newCategoryId is undefined after creation');
  });

  beforeEach(async () => {
    await prisma.dish.deleteMany();
  });

  afterAll(async () => {
    await cleanupUserAndRelatedData(prisma, adminUser.email);
    await app.close();
  });

  async function createDishForTest(dishData: any) {
    const res = await request(server)
      .post('/dish/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(dishData);
    if (res.status !== 201) {
      console.error(
        'Failed to create dish in test helper:',
        res.status,
        res.body,
        'Payload:',
        dishData,
      );
      throw new Error(`Dish creation failed with status ${res.status}`);
    }
    return res.body;
  }

  it('should create a new dish and verify all its details', async () => {
    const currentDishData = {
      ...baseDishData,
      name: 'New Test Dish Create',
      categoryId,
    };
    const createdDish = await createDishForTest(currentDishData);

    expect(createdDish).toHaveProperty('id');
    expect(createdDish.name).toBe(currentDishData.name);
    expect(createdDish.description).toBe(currentDishData.description);
    expect(createdDish.price).toBe(currentDishData.price);
    expect(createdDish.imageUrl).toBe(currentDishData.imageUrl);
    expect(createdDish.ingredients).toEqual(currentDishData.ingredients);
    expect(createdDish.weightGr).toBe(currentDishData.weightGr);
    expect(createdDish.calories).toBe(currentDishData.calories);
    expect(createdDish.available).toBe(currentDishData.available);
    expect(createdDish.categoryId).toBe(categoryId);
  });

  it('should return conflict when creating a duplicate dish', async () => {
    const currentDishData = {
      ...baseDishData,
      name: 'Conflict Dish Test',
      categoryId,
    };
    await createDishForTest(currentDishData);

    const res = await request(server)
      .post('/dish/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(currentDishData)
      .expect(409);

    expect(res.body.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message');
  });

  it('should get dish by ID and verify all its details', async () => {
    const currentDishData = {
      ...baseDishData,
      name: 'Dish For Get By ID Test',
      categoryId,
    };
    const createdDish = await createDishForTest(currentDishData);

    const res = await request(server)
      .get(`/dish/${createdDish.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.name).toBe(currentDishData.name);
    expect(res.body.description).toBe(currentDishData.description);
    expect(res.body.price).toBe(currentDishData.price);
    expect(res.body.imageUrl).toBe(currentDishData.imageUrl);
    expect(res.body.ingredients).toEqual(currentDishData.ingredients);
    expect(res.body.weightGr).toBe(currentDishData.weightGr);
    expect(res.body.calories).toBe(currentDishData.calories);
    expect(res.body.available).toBe(currentDishData.available);
    expect(res.body.categoryId).toBe(categoryId);
  });

  it('should update the dish and verify changes to multiple fields', async () => {
    const currentDishData = {
      ...baseDishData,
      name: 'Dish For Update Test',
      categoryId,
    };
    const createdDish = await createDishForTest(currentDishData);

    const payloadForUpdate = {
      ...updatedDishPayload,
      categoryId: newCategoryId,
    };
    const res = await request(server)
      .patch(`/dish/${createdDish.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payloadForUpdate)
      .expect(200);

    expect(res.body.id).toBe(createdDish.id);
    expect(res.body.name).toBe(payloadForUpdate.name);
    expect(res.body.price).toBe(payloadForUpdate.price);
    expect(res.body.available).toBe(payloadForUpdate.available);
    expect(res.body.description).toBe(payloadForUpdate.description);
    expect(res.body.imageUrl).toBe(payloadForUpdate.imageUrl);
    expect(res.body.ingredients).toEqual(payloadForUpdate.ingredients);
    expect(res.body.weightGr).toBe(payloadForUpdate.weightGr);
    expect(res.body.calories).toBe(payloadForUpdate.calories);
    expect(res.body.categoryId).toBe(newCategoryId);
  });

  it('should correctly update dish category to null', async () => {
    const currentDishData = {
      ...baseDishData,
      name: 'Dish For Null Category Update',
      categoryId,
    };
    const createdDish = await createDishForTest(currentDishData);

    const res = await request(server)
      .patch(`/dish/${createdDish.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ categoryId: null })
      .expect(200);

    expect(res.body.id).toBe(createdDish.id);
    expect(res.body.categoryId).toBeNull();
  });

  it('should delete the dish', async () => {
    const currentDishData = {
      ...baseDishData,
      name: 'Dish For Delete Test',
      categoryId,
    };
    const createdDish = await createDishForTest(currentDishData);

    await request(server)
      .delete(`/dish/${createdDish.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(server)
      .get(`/dish/${createdDish.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('should return 404 for non-existing dish', async () => {
    await request(server)
      .get(`/dish/${nonExistingId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    await request(server)
      .patch(`/dish/${nonExistingId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedDishPayload)
      .expect(404);

    await request(server)
      .delete(`/dish/${nonExistingId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    await request(server)
      .patch(`/dish/${nonExistingId}/remove-category`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    await request(server)
      .patch(`/dish/${nonExistingId}/assign-category/${newCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('should remove category from dish', async () => {
    const currentDishData = {
      ...baseDishData,
      name: 'Dish For Remove Category Test',
      categoryId,
    };
    const createdDish = await createDishForTest(currentDishData);

    const res = await request(server)
      .patch(`/dish/${createdDish.id}/remove-category`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id).toBe(createdDish.id);
    expect(res.body.categoryId).toBeNull();
  });

  it('should assign a category to a dish', async () => {
    const currentDishData = {
      ...baseDishData,
      name: 'Dish For Assign Category Test',
    };
    const createdDish = await createDishForTest(currentDishData);
    expect(createdDish.categoryId).toBeNull();

    const res = await request(server)
      .patch(`/dish/${createdDish.id}/assign-category/${newCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id).toBe(createdDish.id);
    expect(res.body.categoryId).toBe(newCategoryId);
  });

  it('should return 404 when trying to assign non-existing category to a dish', async () => {
    const currentDishData = {
      ...baseDishData,
      name: 'Dish For Assign NonExist Category',
      categoryId,
    };
    const createdDish = await createDishForTest(currentDishData);

    await request(server)
      .patch(`/dish/${createdDish.id}/assign-category/${nonExistingId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('should assign a new category to a dish that already has one', async () => {
    const currentDishData = {
      ...baseDishData,
      name: 'Dish For Reassign Category',
      categoryId,
    };
    const createdDish = await createDishForTest(currentDishData);
    expect(createdDish.categoryId).toBe(categoryId);

    const res = await request(server)
      .patch(`/dish/${createdDish.id}/assign-category/${newCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id).toBe(createdDish.id);
    expect(res.body.categoryId).toBe(newCategoryId);
  });

  it('should successfully handle removing category from a dish that has no category', async () => {
    const currentDishData = {
      ...baseDishData,
      name: 'Dish With No Category For Removal Test',
    };
    const createdDish = await createDishForTest(currentDishData);
    expect(createdDish.categoryId).toBeNull();

    const res = await request(server)
      .patch(`/dish/${createdDish.id}/remove-category`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id).toBe(createdDish.id);
    expect(res.body.categoryId).toBeNull();

    const res2 = await request(server)
      .patch(`/dish/${createdDish.id}/remove-category`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res2.body.id).toBe(createdDish.id);
    expect(res2.body.categoryId).toBeNull();
  });
});
