import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { PrismaService } from 'prisma/prisma.service';
import { CompanyContextMiddleware } from 'src/common/middleware/company-context.middleware';
import * as request from 'supertest';
import { getAuthToken } from 'test/utils/auth-test';
import { BASE_URL, HOST } from 'test/utils/constants';
import { cleanTestDb } from 'test/utils/db-utils';
import { FakeDTO } from 'test/utils/faker';
import { createTable, makeRequest } from 'test/utils/form-utils';

describe('TableModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let companyId: number;
  let tableId: number;

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
  });

  beforeEach(async () => {
    await prisma.table.deleteMany({ where: { companyId } });
    const res = await createTable(app, token);
    tableId = res.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new table', async () => {
    const dto = FakeDTO.table.create();
    const res = await createTable(app, token, dto);
    expect(res).toHaveProperty('id');
    expect(res.number).toBe(dto.number);
    expect(res.seats).toBe(dto.seats);
  });

  it('should not allow duplicate table number', async () => {
    const table = await prisma.table.findFirst({ where: { companyId } });
    if (!table) throw new Error('No table found for the test company');
    await makeRequest(app, token, 'post', `${BASE_URL.TABLE}/create`)
      .send({ number: table.number, seats: 4 })
      .expect(409);
  });

  it('should get all tables', async () => {
    const res = await makeRequest(
      app,
      token,
      'get',
      `${BASE_URL.TABLE}`,
    ).expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should get table by id', async () => {
    const res = await makeRequest(
      app,
      token,
      'get',
      `${BASE_URL.TABLE}/${tableId}`,
    ).expect(200);
    expect(res.body.id).toBe(tableId);
  });

  it('should return 404 for non-existing id', async () => {
    await makeRequest(app, token, 'get', `${BASE_URL.TABLE}/99999`).expect(404);
  });

  it('should return 400 for invalid id', async () => {
    await makeRequest(app, token, 'get', `${BASE_URL.TABLE}/invalid`).expect(
      400,
    );
  });

  it('should update a table', async () => {
    const dto = { number: 99, seats: 6 };
    const res = await makeRequest(
      app,
      token,
      'patch',
      `${BASE_URL.TABLE}/${tableId}`,
    )
      .send(dto)
      .expect(200);
    expect(res.body.number).toBe(dto.number);
    expect(res.body.seats).toBe(dto.seats);
  });

  it('should delete a table', async () => {
    const dto = FakeDTO.table.create();
    const res = await makeRequest(
      app,
      token,
      'post',
      `${BASE_URL.TABLE}/create`,
    )
      .send(dto)
      .expect(201);
    const id = res.body.id;

    await makeRequest(app, token, 'delete', `${BASE_URL.TABLE}/${id}`).expect(
      200,
    );
    await makeRequest(app, token, 'get', `${BASE_URL.TABLE}/${id}`).expect(404);
  });

  it('should return 409 when deleting inactive table', async () => {
    await prisma.table.update({
      where: { id: tableId },
      data: { active: false },
    });
    await makeRequest(
      app,
      token,
      'delete',
      `${BASE_URL.TABLE}/${tableId}`,
    ).expect(409);
  });

  it('should deny access without token', async () => {
    await request(app.getHttpServer())
      .get(`${BASE_URL.TABLE}`)
      .expect(401)
      .set('Host', HOST);
    await request(app.getHttpServer())
      .post(`${BASE_URL.TABLE}/create`)
      .set('Host', HOST)
      .send(FakeDTO.table.create())
      .expect(401);
    await request(app.getHttpServer())
      .patch(`${BASE_URL.TABLE}/${tableId}`)
      .set('Host', HOST)
      .send({ number: 7 })
      .expect(401);
    await request(app.getHttpServer())
      .delete(`${BASE_URL.TABLE}/${tableId}`)
      .set('Host', HOST)
      .expect(401);
  });
});
