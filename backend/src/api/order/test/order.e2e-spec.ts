import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { PrismaService } from 'prisma/prisma.service';
import { CompanyContextMiddleware } from 'src/common/middleware/company-context.middleware';
import { getAuthSubUser, getAuthToken } from 'test/utils/auth-test';
import { BASE_URL } from 'test/utils/constants';
import { cleanTestDb } from 'test/utils/db-utils';
import { FakeDTO } from 'test/utils/faker';
import {
  createCategory,
  createDish,
  createTable,
  makeRequest,
} from 'test/utils/form-utils';

describe('Order (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let companyId: number;
  let categoryId: number;

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
    adminToken = auth.token;
    companyId = auth.companyId;

    const category = await createCategory(app, adminToken);
    categoryId = category.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new order', async () => {
    const waiterDto = FakeDTO.user.waiter();
    const waiterToken = await getAuthSubUser(app, adminToken, waiterDto);
    const dish = await createDish(app, adminToken, categoryId);
    const table = await createTable(app, adminToken);
    const dto = FakeDTO.order.create(dish.id, table.id);
    const res = await makeRequest(
      app,
      waiterToken,
      'post',
      `${BASE_URL.ORDER}/create`,
    )
      .send(dto)
      .expect(201);

    expect(res.body).toMatchObject({
      waiterId: expect.any(Number),
      status: 'PENDING',
      companyId,
      tableId: table.id,
      orderItems: expect.any(Array),
    });

    expect(res.body.orderItems[0]).toMatchObject({
      dishId: dish.id,
      quantity: dto.items[0].quantity,
      notes: dto.items[0].notes,
    });
  });
});
