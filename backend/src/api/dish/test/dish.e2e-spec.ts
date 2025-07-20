import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { PrismaService } from 'prisma/prisma.service';
import { CompanyContextMiddleware } from 'src/common/middleware/company-context.middleware';
import * as request from 'supertest';
import { getAuthToken } from 'test/utils/auth-test';
import { BASE_URL, HOST, logoPath } from 'test/utils/constants';
import { cleanTestDb } from 'test/utils/db-utils';
import { FakeDTO } from 'test/utils/faker';
import { createCategory, createDish, makeRequest } from 'test/utils/form-utils';

describe('Dish (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let companyId: number;
  let categoryId: number;
  let dishId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    prisma = moduleRef.get(PrismaService);
    const middleware = new CompanyContextMiddleware(prisma);
    app.use(middleware.use.bind(middleware));
    await app.init();
    await cleanTestDb(prisma);

    const auth = await getAuthToken(app);
    token = auth.token;
    companyId = auth.companyId;
    const category = await createCategory(app, token);
    categoryId = category.id;
  });

  beforeEach(async () => {
    await prisma.dish.deleteMany({ where: { companyId } });
    const dish = await createDish(app, token, categoryId);
    dishId = dish.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/create (POST)', () => {
    it('should create a dish', async () => {
      const dto = {
        ...FakeDTO.dish.create(),
        categoryId,
      };
      const res = await createDish(app, token, categoryId, dto);
      const { price, imageUrl, ...restOfDto } = dto;
      expect(res).toMatchObject({
        ...restOfDto,
        companyId,
      });
      expect(res.price).toBeCloseTo(price);
      expect(res.imageUrl).toEqual(expect.any(String));

      const inDb = await prisma.dish.findUnique({ where: { id: res.id } });
      expect(inDb).toBeDefined();
    });

    it('should fail with invalid data (400 Bad Request)', async () => {
      await makeRequest(app, token, 'post', `${BASE_URL.DISH}/create`)
        .set('Host', HOST)
        .field('name', '')
        .field('price', '-10')
        .attach('imageUrl', logoPath)
        .expect(400);
    });

    it('should fail to create a dish without an image (400 Bad Request)', async () => {
      const dto = FakeDTO.dish.create();
      await makeRequest(app, token, 'post', `${BASE_URL.DISH}/create`)
        .field('name', dto.name)
        .field('price', dto.price.toString())
        .expect(400);
    });

    it('should fail to create a dish with a duplicate name (409 Conflict)', async () => {
      const existingDish = await prisma.dish.findFirst({
        where: { id: dishId },
      });

      const dto = FakeDTO.dish.create();

      await makeRequest(app, token, 'post', `${BASE_URL.DISH}/create`)
        .field('name', existingDish!.name)
        .field('description', dto.description)
        .field('price', dto.price.toString())
        .field('categoryId', categoryId.toString())
        .field('ingredients', dto.ingredients.join(','))
        .field('weightGr', dto.weightGr.toString())
        .field('calories', dto.calories.toString())
        .field('available', dto.available.toString())
        .attach('imageUrl', logoPath)
        .expect(409);
    });
  });

  describe('/ (GET)', () => {
    beforeEach(async () => {
      await prisma.dish.deleteMany({ where: { companyId } });
      await createDish(app, token, categoryId, {
        name: 'Pizza Carbonara',
        price: 150,
        available: true,
      });
      await createDish(app, token, categoryId, {
        name: 'Sushi Set',
        price: 350,
        available: true,
      });
      await createDish(app, token, categoryId, {
        name: 'Borsch Soup',
        price: 80,
        available: false,
      });
    });

    it('should return paginated dishes', async () => {
      const res = await makeRequest(app, token, 'get', BASE_URL.DISH).expect(
        200,
      );
      expect(res.body.data.length).toBe(3);
      expect(res.body.total).toBe(3);
    });

    it('should filter dishes by search term', async () => {
      const res = await makeRequest(
        app,
        token,
        'get',
        `${BASE_URL.DISH}?search=Pizza`,
      ).expect(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe('Pizza Carbonara');
    });

    it('should filter dishes by price range', async () => {
      const res = await makeRequest(
        app,
        token,
        'get',
        `${BASE_URL.DISH}?minPrice=100&maxPrice=200`,
      ).expect(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe('Pizza Carbonara');
    });

    it('should filter by availability', async () => {
      const res = await makeRequest(
        app,
        token,
        'get',
        `${BASE_URL.DISH}?available=false`,
      ).expect(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe('Borsch Soup');
    });

    it('should sort dishes by name ascending', async () => {
      const res = await makeRequest(
        app,
        token,
        'get',
        `${BASE_URL.DISH}?sortBy=name&order=asc`,
      ).expect(200);
      const names = res.body.data.map((d: any) => d.name);
      expect(names).toEqual(['Borsch Soup', 'Pizza Carbonara', 'Sushi Set']);
    });

    it('should sort dishes by price descending', async () => {
      const res = await makeRequest(
        app,
        token,
        'get',
        `${BASE_URL.DISH}?sortBy=price&order=desc`,
      ).expect(200);
      const prices = res.body.data.map((d: any) => d.price);
      expect(prices).toEqual([350, 150, 80]);
    });
  });

  describe('/:id (GET, PATCH, DELETE)', () => {
    it('should get a specific dish by ID', async () => {
      const res = await makeRequest(
        app,
        token,
        'get',
        `${BASE_URL.DISH}/${dishId}`,
      ).expect(200);
      expect(res.body.id).toBe(dishId);
    });

    it('should return 404 for a non-existent dish ID', async () => {
      await makeRequest(app, token, 'get', `${BASE_URL.DISH}/999999`).expect(
        404,
      );
    });

    it("should update a dish's text details", async () => {
      const updateDto = {
        name: 'Updated Name',
        description: 'Updated Description',
      };
      const res = await makeRequest(
        app,
        token,
        'patch',
        `${BASE_URL.DISH}/${dishId}`,
      )
        .field('name', updateDto.name)
        .field('description', updateDto.description)
        .expect(200);

      expect(res.body.name).toBe(updateDto.name);
      expect(res.body.description).toBe(updateDto.description);
    });

    it('should return 404 when updating a non-existent dish', async () => {
      await makeRequest(app, token, 'patch', `${BASE_URL.DISH}/999999`)
        .field('name', 'does not matter')
        .expect(404);
    });

    it('should delete a dish', async () => {
      await makeRequest(
        app,
        token,
        'delete',
        `${BASE_URL.DISH}/${dishId}`,
      ).expect(200);
      await makeRequest(app, token, 'get', `${BASE_URL.DISH}/${dishId}`).expect(
        404,
      );
    });

    it('should return 404 when deleting a non-existent dish', async () => {
      await makeRequest(app, token, 'delete', `${BASE_URL.DISH}/999999`).expect(
        404,
      );
    });
  });

  describe('Category Management', () => {
    it('should assign a category to a dish', async () => {
      const newCategory = await createCategory(app, token, {
        name: 'New Test Category',
      });
      const res = await makeRequest(
        app,
        token,
        'patch',
        `${BASE_URL.DISH}/${dishId}/assign-category/${newCategory.id}`,
      ).expect(200);
      expect(res.body.categoryId).toBe(newCategory.id);
    });

    it('should remove a category from a dish', async () => {
      const res = await makeRequest(
        app,
        token,
        'patch',
        `${BASE_URL.DISH}/${dishId}/remove-category`,
      ).expect(200);
      expect(res.body.categoryId).toBeNull();
    });

    it('should return 404 when assigning a non-existent category', async () => {
      await makeRequest(
        app,
        token,
        'patch',
        `${BASE_URL.DISH}/${dishId}/assign-category/99999`,
      ).expect(404);
    });
  });

  describe('Authorization', () => {
    it('should block access to admin routes without a token', async () => {
      await request(app.getHttpServer())
        .post(`${BASE_URL.DISH}/create`)
        .set('Host', HOST)
        .expect(401);
      await request(app.getHttpServer())
        .patch(`${BASE_URL.DISH}/1`)
        .set('Host', HOST)
        .expect(401);
      await request(app.getHttpServer())
        .delete(`${BASE_URL.DISH}/1`)
        .set('Host', HOST)
        .expect(401);
    });
  });
});
