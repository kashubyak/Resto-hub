import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { PrismaService } from 'prisma/prisma.service';
import { CompanyContextMiddleware } from 'src/common/middleware/company-context.middleware';
import * as request from 'supertest';
import { getAuthToken } from 'test/utils/auth-test';
import { cleanTestDb } from 'test/utils/db-utils';
import { fakeTable } from 'test/utils/faker';

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

    const tableDto = fakeTable();
    const res = await request(app.getHttpServer())
      .post('/api/table/create')
      .set('Authorization', `Bearer ${token}`)
      .set('Host', 'testcompany.localhost')
      .send(tableDto)
      .expect(201);

    tableId = res.body.id;
  });

  it('should create a new table', async () => {
    const dto = fakeTable();

    const res = await request(app.getHttpServer())
      .post('/api/table/create')
      .set('Authorization', `Bearer ${token}`)
      .set('Host', 'testcompany.localhost')
      .send(dto)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.number).toBe(dto.number);
    expect(res.body.seats).toBe(dto.seats);
  });

  it('should not allow duplicate table number', async () => {
    const table = await prisma.table.findFirst({ where: { companyId } });
    if (!table) throw new Error('No table found for the test company');

    await request(app.getHttpServer())
      .post('/api/table/create')
      .set('Authorization', `Bearer ${token}`)
      .set('Host', 'testcompany.localhost')
      .send({ number: table.number, seats: 4 })
      .expect(409);
  });

  it('should get all tables', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/table')
      .set('Authorization', `Bearer ${token}`)
      .set('Host', 'testcompany.localhost')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should get table by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/table/${tableId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Host', 'testcompany.localhost')
      .expect(200);

    expect(res.body.id).toBe(tableId);
  });

  it('should return 404 for non-existing id', async () => {
    await request(app.getHttpServer())
      .get(`/api/table/99999`)
      .set('Authorization', `Bearer ${token}`)
      .set('Host', 'testcompany.localhost')
      .expect(404);
  });

  it('should return 400 for invalid id', async () => {
    await request(app.getHttpServer())
      .get(`/api/table/invalid`)
      .set('Authorization', `Bearer ${token}`)
      .set('Host', 'testcompany.localhost')
      .expect(400);
  });

  it('should update a table', async () => {
    const dto = { number: 99, seats: 6 };

    const res = await request(app.getHttpServer())
      .patch(`/api/table/${tableId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Host', 'testcompany.localhost')
      .send(dto)
      .expect(200);

    expect(res.body.number).toBe(dto.number);
    expect(res.body.seats).toBe(dto.seats);
  });

  it('should delete a table', async () => {
    const dto = fakeTable();
    const res = await request(app.getHttpServer())
      .post('/api/table/create')
      .set('Authorization', `Bearer ${token}`)
      .set('Host', 'testcompany.localhost')
      .send(dto)
      .expect(201);

    const id = res.body.id;

    await request(app.getHttpServer())
      .delete(`/api/table/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Host', 'testcompany.localhost')
      .expect(200);

    await request(app.getHttpServer())
      .get(`/api/table/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('should return 409 when deleting inactive table', async () => {
    await prisma.table.update({
      where: { id: tableId },
      data: { active: false },
    });

    await request(app.getHttpServer())
      .delete(`/api/table/${tableId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Host', 'testcompany.localhost')
      .expect(409);
  });

  it('should deny access without token', async () => {
    await request(app.getHttpServer())
      .get('/api/table')
      .expect(401)
      .set('Host', 'testcompany.localhost');
    await request(app.getHttpServer())
      .post('/api/table/create')
      .set('Host', 'testcompany.localhost')
      .send(fakeTable())
      .expect(401);
    await request(app.getHttpServer())
      .patch(`/api/table/${tableId}`)
      .set('Host', 'testcompany.localhost')
      .send({ number: 7 })
      .expect(401);
    await request(app.getHttpServer())
      .delete(`/api/table/${tableId}`)
      .set('Host', 'testcompany.localhost')
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
