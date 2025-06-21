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
    role: 'ADMIN',
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

    await prisma.$transaction([
      prisma.dish.deleteMany(),
      prisma.user.deleteMany(),
    ]);

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

  it('should return all dishes with default pagination if no query parameters are provided', async () => {
    await createDishForTest({ ...baseDishData, name: 'Dish A', price: 10 });
    await createDishForTest({ ...baseDishData, name: 'Dish B', price: 20 });
    await createDishForTest({ ...baseDishData, name: 'Dish C', price: 30 });

    const res = await request(server)
      .get('/dish/search')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.items).toBeInstanceOf(Array);
    expect(res.body.items.length).toBe(3);
    expect(res.body.total).toBe(3);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(10);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.items[0].name).toBe('Dish C');
  });

  it('should filter dishes by search term (name)', async () => {
    await createDishForTest({ ...baseDishData, name: 'Spicy Noodles' });
    await createDishForTest({ ...baseDishData, name: 'Chicken Curry' });
    await createDishForTest({ ...baseDishData, name: 'Spicy Soup' });

    const res = await request(server)
      .get('/dish/search?search=spicy')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.items.length).toBe(2);
    expect(res.body.items.some((d: any) => d.name === 'Spicy Noodles')).toBe(
      true,
    );
    expect(res.body.items.some((d: any) => d.name === 'Spicy Soup')).toBe(true);
    expect(res.body.items.some((d: any) => d.name === 'Chicken Curry')).toBe(
      false,
    );
  });

  it('should filter dishes by minimum price', async () => {
    await createDishForTest({ ...baseDishData, name: 'Cheap Dish', price: 5 });
    await createDishForTest({
      ...baseDishData,
      name: 'Medium Dish',
      price: 15,
    });
    await createDishForTest({
      ...baseDishData,
      name: 'Expensive Dish',
      price: 25,
    });

    const res = await request(server)
      .get('/dish/search?minPrice=10')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.items.length).toBe(2);
    expect(res.body.items.every((d: any) => d.price >= 10)).toBe(true);
  });

  it('should filter dishes by maximum price', async () => {
    await createDishForTest({ ...baseDishData, name: 'Cheap Dish', price: 5 });
    await createDishForTest({
      ...baseDishData,
      name: 'Medium Dish',
      price: 15,
    });
    await createDishForTest({
      ...baseDishData,
      name: 'Expensive Dish',
      price: 25,
    });

    const res = await request(server)
      .get('/dish/search?maxPrice=20')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.items.length).toBe(2);
    expect(res.body.items.every((d: any) => d.price <= 20)).toBe(true);
  });

  it('should filter dishes by price range (minPrice and maxPrice)', async () => {
    await createDishForTest({ ...baseDishData, name: 'Dish 1', price: 5 });
    await createDishForTest({ ...baseDishData, name: 'Dish 2', price: 15 });
    await createDishForTest({ ...baseDishData, name: 'Dish 3', price: 25 });

    const res = await request(server)
      .get('/dish/search?minPrice=10&maxPrice=20')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].name).toBe('Dish 2');
  });

  it('should filter dishes by availability (available=true)', async () => {
    await createDishForTest({
      ...baseDishData,
      name: 'Available Dish',
      available: true,
    });
    await createDishForTest({
      ...baseDishData,
      name: 'Unavailable Dish',
      available: false,
    });

    const res = await request(server)
      .get('/dish/search?available=true')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].name).toBe('Available Dish');
    expect(res.body.items[0].available).toBe(true);
  });

  it('should filter dishes by availability (available=false)', async () => {
    await createDishForTest({
      ...baseDishData,
      name: 'Available Dish',
      available: true,
    });
    await createDishForTest({
      ...baseDishData,
      name: 'Unavailable Dish',
      available: false,
    });

    const res = await request(server)
      .get('/dish/search?available=false')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].name).toBe('Unavailable Dish');
    expect(res.body.items[0].available).toBe(false);
  });

  it('should sort dishes by name in ascending order', async () => {
    await createDishForTest({ ...baseDishData, name: 'Zebra Dish' });
    await createDishForTest({ ...baseDishData, name: 'Apple Dish' });
    await createDishForTest({ ...baseDishData, name: 'Banana Dish' });

    const res = await request(server)
      .get('/dish/search?sortBy=name&order=asc')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.items.length).toBe(3);
    expect(res.body.items.map((d: any) => d.name)).toEqual([
      'Apple Dish',
      'Banana Dish',
      'Zebra Dish',
    ]);
  });

  it('should sort dishes by price in descending order', async () => {
    await createDishForTest({ ...baseDishData, name: 'Dish 1', price: 10 });
    await createDishForTest({ ...baseDishData, name: 'Dish 2', price: 30 });
    await createDishForTest({ ...baseDishData, name: 'Dish 3', price: 20 });

    const res = await request(server)
      .get('/dish/search?sortBy=price&order=desc')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.items.length).toBe(3);
    expect(res.body.items.map((d: any) => d.price)).toEqual([30, 20, 10]);
  });

  it('should paginate results correctly with page and limit', async () => {
    for (let i = 1; i <= 5; i++) {
      await createDishForTest({ ...baseDishData, name: `Paginated Dish ${i}` });
    }

    const resPage1 = await request(server)
      .get('/dish/search?page=1&limit=2')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(resPage1.body.items.length).toBe(2);
    expect(resPage1.body.total).toBe(5);
    expect(resPage1.body.page).toBe(1);
    expect(resPage1.body.limit).toBe(2);
    expect(resPage1.body.totalPages).toBe(3);

    const resPage2 = await request(server)
      .get('/dish/search?page=2&limit=2')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(resPage2.body.items.length).toBe(2);
    expect(resPage2.body.page).toBe(2);

    const resPage3 = await request(server)
      .get('/dish/search?page=3&limit=2')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(resPage3.body.items.length).toBe(1);
    expect(resPage3.body.page).toBe(3);
  });

  it('should combine multiple filters and sorting', async () => {
    await createDishForTest({
      ...baseDishData,
      name: 'Burger',
      price: 15,
      available: true,
    });
    await createDishForTest({
      ...baseDishData,
      name: 'Salad',
      price: 10,
      available: true,
    });
    await createDishForTest({
      ...baseDishData,
      name: 'Steak',
      price: 25,
      available: false,
    });
    await createDishForTest({
      ...baseDishData,
      name: 'Pasta',
      price: 18,
      available: true,
    });

    const res = await request(server)
      .get(
        '/dish/search?search=a&minPrice=10&available=true&sortBy=price&order=desc',
      )
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.items.length).toBe(2);
    expect(res.body.items.map((d: any) => d.name)).toEqual(['Pasta', 'Salad']);
  });

  it('should return empty array if no dishes match filters', async () => {
    await createDishForTest({
      ...baseDishData,
      name: 'Existing Dish',
      price: 10,
    });

    const res = await request(server)
      .get('/dish/search?search=nonexistent&minPrice=100')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.items).toBeInstanceOf(Array);
    expect(res.body.items.length).toBe(0);
    expect(res.body.total).toBe(0);
  });

  it('should return 400 for invalid query parameters (e.g., non-numeric price)', async () => {
    await request(server)
      .get('/dish/search?minPrice=abc')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400);

    await request(server)
      .get('/dish/search?page=invalid')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400);

    await request(server)
      .get('/dish/search?sortBy=invalidColumn')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400);

    await request(server)
      .get('/dish/search?order=invalidOrder')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400);
  });

  it('should handle large page numbers gracefully, returning empty array if out of bounds', async () => {
    await createDishForTest({ ...baseDishData, name: 'Dish A' });
    await createDishForTest({ ...baseDishData, name: 'Dish B' });

    const res = await request(server)
      .get('/dish/search?page=100&limit=10')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.items).toBeInstanceOf(Array);
    expect(res.body.items.length).toBe(0);
    expect(res.body.total).toBe(2);
    expect(res.body.page).toBe(100);
    expect(res.body.limit).toBe(10);
  });
});
