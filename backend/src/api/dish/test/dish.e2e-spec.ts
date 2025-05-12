import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import * as cookieParser from 'cookie-parser';
import { PrismaService } from 'prisma/prisma.service';
import * as request from 'supertest';

describe('DishController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let prisma: PrismaService;
  let adminToken: string;
  let dishId: number;
  let categoryId: number;
  const nonExistingId = 9999;

  const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'adminpass123',
    role: 'ADMIN',
  };

  const dishData = {
    name: 'Test Dish',
    description: 'Delicious',
    price: 10.99,
    imageUrl: 'https://example.com/dish.jpg',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    weightGr: 500,
    calories: 600,
    available: true,
  };

  const updatedDishData = {
    name: 'Updated Dish',
    price: 12.99,
    available: false,
    description: 'Even more delicious!',
    imageUrl: 'https://example.com/updated-dish.jpg',
    ingredients: ['New Ingredient'],
    weightGr: 600,
    calories: 700,
    categoryId: null, // Для тесту зміни категорії
  };

  const categoryData = { name: 'Test Category' };
  const newCategoryData = { name: 'New Test Category' };
  let newCategoryId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(cookieParser());

    prisma = app.get(PrismaService);
    await prisma.user.deleteMany();
    await prisma.dish.deleteMany();
    await prisma.category.deleteMany({ where: { name: categoryData.name } });
    await prisma.category.deleteMany({ where: { name: newCategoryData.name } });

    await app.init();
    server = app.getHttpServer();

    await request(server).post('/auth/register').send(adminUser);
    const loginRes = await request(server).post('/auth/login').send({
      email: adminUser.email,
      password: adminUser.password,
    });
    adminToken = loginRes.body.token;
    expect(adminToken).toBeDefined();

    const categoryRes = await request(server)
      .post('/category/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(categoryData)
      .expect(201);
    categoryId = categoryRes.body.id;

    const newCategoryRes = await request(server)
      .post('/category/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newCategoryData)
      .expect(201);
    newCategoryId = newCategoryRes.body.id;
  });

  beforeEach(async () => {
    await prisma.dish.deleteMany({ where: { name: dishData.name } });
    const createRes = await request(server)
      .post('/dish/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...dishData, categoryId })
      .expect(201);
    dishId = createRes.body.id;
  });

  afterAll(async () => {
    await prisma.dish.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('should create a new dish and verify all its details', async () => {
    await prisma.dish.deleteMany({ where: { name: 'New Test Dish' } });
    const newDishData = { ...dishData, name: 'New Test Dish' };
    const res = await request(server)
      .post('/dish/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...newDishData, categoryId })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(newDishData.name);
    expect(res.body.description).toBe(newDishData.description);
    expect(res.body.price).toBe(newDishData.price);
    expect(res.body.imageUrl).toBe(newDishData.imageUrl);
    expect(res.body.ingredients).toEqual(newDishData.ingredients);
    expect(res.body.weightGr).toBe(newDishData.weightGr);
    expect(res.body.calories).toBe(newDishData.calories);
    expect(res.body.available).toBe(newDishData.available);
    expect(res.body.categoryId).toBe(categoryId);
  });

  it('should return conflict when creating a duplicate dish', async () => {
    const res = await request(server)
      .post('/dish/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...dishData, categoryId })
      .expect(409);

    expect(res.body.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message');
  });

  it('should return all dishes', async () => {
    const res = await request(server)
      .get('/dish')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((dish) => dish.name === dishData.name)).toBe(true);
  });

  it('should get dish by ID and verify all its details', async () => {
    const res = await request(server)
      .get(`/dish/${dishId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.name).toBe(dishData.name);
    expect(res.body.description).toBe(dishData.description);
    expect(res.body.price).toBe(dishData.price);
    expect(res.body.imageUrl).toBe(dishData.imageUrl);
    expect(res.body.ingredients).toEqual(dishData.ingredients);
    expect(res.body.weightGr).toBe(dishData.weightGr);
    expect(res.body.calories).toBe(dishData.calories);
    expect(res.body.available).toBe(dishData.available);
    expect(res.body.categoryId).toBe(categoryId);
  });

  it('should update the dish and verify changes to multiple fields', async () => {
    const res = await request(server)
      .patch(`/dish/${dishId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedDishData)
      .expect(200);

    expect(res.body.id).toBe(dishId);
    expect(res.body.name).toBe(updatedDishData.name);
    expect(res.body.price).toBe(updatedDishData.price);
    expect(res.body.available).toBe(updatedDishData.available);
    expect(res.body.description).toBe(updatedDishData.description);
    expect(res.body.imageUrl).toBe(updatedDishData.imageUrl);
    expect(res.body.ingredients).toEqual(updatedDishData.ingredients);
    expect(res.body.weightGr).toBe(updatedDishData.weightGr);
    expect(res.body.calories).toBe(updatedDishData.calories);
    expect(res.body.categoryId).toBeNull();
  });

  it('should delete the dish', async () => {
    await request(server)
      .delete(`/dish/${dishId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const getRes = await request(server)
      .get(`/dish/${dishId}`)
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
      .send(updatedDishData)
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
    const res = await request(server)
      .patch(`/dish/${dishId}/remove-category`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id).toBe(dishId);
    expect(res.body.categoryId).toBeNull();
  });

  it('should assign a category to a dish', async () => {
    const res = await request(server)
      .patch(`/dish/${dishId}/assign-category/${newCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id).toBe(dishId);
    expect(res.body.categoryId).toBe(newCategoryId);
  });

  it('should return 404 when trying to assign non-existing category to a dish', async () => {
    await request(server)
      .patch(`/dish/${dishId}/assign-category/${nonExistingId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('should assign a new category to a dish that already has one', async () => {
    const res = await request(server)
      .patch(`/dish/${dishId}/assign-category/${newCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id).toBe(dishId);
    expect(res.body.categoryId).toBe(newCategoryId);
  });

  it('should successfully handle removing category from a dish that has no category', async () => {
    await request(server)
      .patch(`/dish/${dishId}/remove-category`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const res = await request(server)
      .patch(`/dish/${dishId}/remove-category`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id).toBe(dishId);
    expect(res.body.categoryId).toBeNull();
  });
});
