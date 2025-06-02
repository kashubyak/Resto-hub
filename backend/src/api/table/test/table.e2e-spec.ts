import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { PrismaService } from 'prisma/prisma.service';
import * as request from 'supertest';
import { getAuthToken } from 'test/utils/auth-test';

describe('Table e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let access_token: string;
  let createdTableId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get(PrismaService);

    const adminDto = {
      email: 'admin@admin.com',
      password: 'adminpass',
      name: 'Admin',
      role: 'ADMIN',
    };

    access_token = await getAuthToken(app, adminDto);
    if (!access_token)
      throw new Error('Admin token not received for table tests');
  });

  beforeEach(async () => {
    await prisma.table.deleteMany();
    const dto = { number: 1, seats: 4 };
    const res = await request(app.getHttpServer())
      .post('/table/create')
      .set('Authorization', `Bearer ${access_token}`)
      .send(dto)
      .expect(201);
    createdTableId = res.body.id;
  });

  it('should create a table', async () => {
    const dto = { number: 2, seats: 5 };

    const res = await request(app.getHttpServer())
      .post('/table/create')
      .set('Authorization', `Bearer ${access_token}`)
      .send(dto)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.number).toBe(dto.number);
    expect(res.body.seats).toBe(dto.seats);
  });

  it('should not allow duplicate table number', async () => {
    const dto = { number: 1, seats: 4 };

    await request(app.getHttpServer())
      .post('/table/create')
      .set('Authorization', `Bearer ${access_token}`)
      .send(dto)
      .expect(409);
  });

  it('should get all tables', async () => {
    const res = await request(app.getHttpServer())
      .get('/table')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should get one table by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/table/${createdTableId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdTableId);
  });

  it('should return 404 for non-existing table', async () => {
    await request(app.getHttpServer())
      .get('/table/99999')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(404);
  });

  it('should return 400 for invalid ID format', async () => {
    await request(app.getHttpServer())
      .get('/table/abc')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400);
  });

  it('should update a table', async () => {
    const dto = { number: 3, seats: 7 };

    const res = await request(app.getHttpServer())
      .patch(`/table/${createdTableId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(dto)
      .expect(200);

    expect(res.body.number).toBe(dto.number);
    expect(res.body.seats).toBe(dto.seats);
  });

  it('should return 404 when updating non-existing table', async () => {
    const dto = { number: 10, seats: 2 };

    await request(app.getHttpServer())
      .patch('/table/99999')
      .set('Authorization', `Bearer ${access_token}`)
      .send(dto)
      .expect(404);
  });

  it('should delete a table', async () => {
    const newTableDto = { number: 4, seats: 2 };
    const createRes = await request(app.getHttpServer())
      .post('/table/create')
      .set('Authorization', `Bearer ${access_token}`)
      .send(newTableDto)
      .expect(201);
    const tableToDeleteId = createRes.body.id;

    await request(app.getHttpServer())
      .delete(`/table/${tableToDeleteId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/table/${tableToDeleteId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(404);
  });

  it('should return 404 when deleting non-existing table', async () => {
    await request(app.getHttpServer())
      .delete('/table/99999')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(404);
  });

  it('should deny creating table without token', async () => {
    await request(app.getHttpServer())
      .post('/table/create')
      .send({ number: 3, seats: 4 })
      .expect(401);
  });

  it('should deny getting all tables without token', async () => {
    await request(app.getHttpServer()).get('/table').expect(401);
  });

  it('should deny getting one table without token', async () => {
    await request(app.getHttpServer()).get('/table/1').expect(401);
  });

  it('should deny updating table without token', async () => {
    await request(app.getHttpServer())
      .patch('/table/1')
      .send({ number: 5, seats: 2 })
      .expect(401);
  });

  it('should deny deleting table without token', async () => {
    await request(app.getHttpServer()).delete('/table/1').expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
