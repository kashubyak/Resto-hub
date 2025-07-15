import { INestApplication } from '@nestjs/common';
import * as path from 'path';
import { PrismaService } from 'prisma/prisma.service';
import * as request from 'supertest';

export async function getAuthToken(
  app: INestApplication,
  companyDto?: Partial<{
    name: string;
    subdomain: string;
    address: string;
    latitude: number;
    longitude: number;
    adminEmail: string;
    adminPassword: string;
    adminName: string;
  }>,
): Promise<{ token: string; companyId: number }> {
  const {
    name = 'Test Company',
    subdomain = 'testcompany',
    address = 'Test Address',
    latitude = 50.45,
    longitude = 30.5234,
    adminEmail = 'admin@example.com',
    adminPassword = 'password123',
    adminName = 'Admin',
  } = companyDto || {};

  const logoPath = path.join(__dirname, '../assets/logo.jpg');
  const avatarPath = path.join(__dirname, '../assets/avatar.webp');

  await request(app.getHttpServer())
    .post('/api/auth/register-company')
    .set('Host', 'localhost')
    .field('name', name)
    .field('subdomain', subdomain)
    .field('address', address)
    .field('latitude', latitude.toString())
    .field('longitude', longitude.toString())
    .field('adminEmail', adminEmail)
    .field('adminPassword', adminPassword)
    .field('adminName', adminName)
    .attach('logoUrl', logoPath)
    .attach('avatarUrl', avatarPath)
    .expect(201);

  const loginRes = await request(app.getHttpServer())
    .post('/api/auth/login')
    .set('Host', `${subdomain}.localhost`)
    .send({ email: adminEmail, password: adminPassword })
    .expect(200);

  const token = loginRes.body.token;

  const prisma = app.get(PrismaService);
  const company = await prisma.company.findUniqueOrThrow({
    where: { subdomain },
    select: { id: true },
  });

  return {
    token,
    companyId: company.id,
  };
}
