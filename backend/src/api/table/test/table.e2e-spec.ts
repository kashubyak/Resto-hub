import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'app.module';
import { PrismaService } from 'prisma/prisma.service';
import * as request from 'supertest';

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

    await prisma.table.deleteMany();
    await prisma.user.deleteMany();

    const adminDto = {
      email: 'admin@admin.com',
      password: 'adminpass',
      name: 'Admin',
      role: 'ADMIN',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(adminDto)
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminDto.email, password: adminDto.password })
      .expect(200);

    access_token = loginRes.body.token;
  });

  it('should create a table', async () => {
    const dto = { number: 1, seats: 4 };

    const res = await request(app.getHttpServer())
      .post('/table/create')
      .set('Authorization', `Bearer ${access_token}`)
      .send(dto)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.number).toBe(dto.number);
    expect(res.body.seats).toBe(dto.seats);

    createdTableId = res.body.id;
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
    expect(res.body.length).toBeGreaterThan(0);
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
    const dto = { number: 2, seats: 6 };

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
    await request(app.getHttpServer())
      .delete(`/table/${createdTableId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/table/${createdTableId}`)
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
