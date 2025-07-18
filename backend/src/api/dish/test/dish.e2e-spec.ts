import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { PrismaService } from 'prisma/prisma.service';
import { CompanyContextMiddleware } from 'src/common/middleware/company-context.middleware';
import * as request from 'supertest';
import { getAuthToken } from 'test/utils/auth-test';
import { BASE_URL, logoPath } from 'test/utils/constants';
import { cleanTestDb } from 'test/utils/db-utils';
import { FakeDTO } from 'test/utils/faker';
import { createCategory, makeRequest } from 'test/utils/form-utils';

describe('Dish (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let companyId: number;
  let categoryId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    prisma = moduleRef.get(PrismaService);
    const middleware = new CompanyContextMiddleware(prisma);
    app.use(middleware.use.bind(middleware));

    await app.init();

    prisma = app.get(PrismaService);
    await cleanTestDb(prisma);

    const auth = await getAuthToken(app);
    token = auth.token;
    companyId = auth.companyId;

    const category = await createCategory(app, token);
    categoryId = category.id;
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

      const res = await request(app.getHttpServer())
        .post(`${BASE_URL.DISH}/create`)
        .set('Authorization', `Bearer ${token}`)
        .set('Host', 'testcompany.localhost')
        .field('name', dto.name)
        .field('description', dto.description)
        .field('price', dto.price.toString())
        .field('categoryId', dto.categoryId.toString())
        .field('ingredients', dto.ingredients.join(','))
        .field('weightGr', dto.weightGr.toString())
        .field('calories', dto.calories.toString())
        .field('available', dto.available.toString())
        .attach('imageUrl', logoPath)
        .expect(201);

      expect(res.body).toMatchObject({
        name: dto.name,
        price: dto.price,
        weightGr: dto.weightGr,
        categoryId,
      });

      const inDb = await prisma.dish.findUniqueOrThrow({
        where: { id: res.body.id },
      });

      expect(inDb).toBeDefined();
      expect(inDb.companyId).toBe(companyId);
    });

    it('should fail with invalid data', async () => {
      const res = await request(app.getHttpServer())
        .post(`${BASE_URL.DISH}/create`)
        .set('Authorization', `Bearer ${token}`)
        .set('Host', 'testcompany.localhost')
        .field('name', '')
        .field('price', '-10')
        .field('weightGr', '0')
        .field('categoryId', '9999')
        // not attaching file
        .expect(400);

      expect(res.body.message).toBeDefined();
    });
  });

  describe('All Dishes (GET)', () => {
    it('should return all dishes', async () => {
      const dishes = Array(3)
        .fill(null)
        .map(() => ({
          ...FakeDTO.dish.create(),
          categoryId,
          companyId,
          imageUrl: 'https://via.placeholder.com/150',
        }));

      for (const dish of dishes) {
        await request(app.getHttpServer())
          .post(`${BASE_URL.DISH}/create`)
          .set('Authorization', `Bearer ${token}`)
          .set('Host', 'testcompany.localhost')
          .field('name', dish.name)
          .field('description', dish.description)
          .field('price', dish.price.toString())
          .field('categoryId', dish.categoryId.toString())
          .field('ingredients', dish.ingredients.join(','))
          .field('weightGr', dish.weightGr.toString())
          .field('calories', dish.calories.toString())
          .field('available', dish.available.toString())
          .attach('imageUrl', logoPath);
      }

      const res = await makeRequest(
        app,
        token,
        'get',
        `${BASE_URL.DISH}`,
      ).expect(200);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);
    });
  });
});
