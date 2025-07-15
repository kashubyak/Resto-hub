import { INestApplication } from '@nestjs/common';
import * as path from 'path';
import * as request from 'supertest';

export async function getAuthToken(
  appInstance: INestApplication,
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
): Promise<string> {
  const {
    name = 'Test Company',
    subdomain = 'testcompany',
    address = 'Test Address',
    latitude = 50.4501,
    longitude = 30.5234,
    adminEmail = 'admin@example.com',
    adminPassword = 'password123',
    adminName = 'Admin',
  } = companyDto || {};

  const logoPath = path.join(__dirname, '../assets/logo.png');
  const avatarPath = path.join(__dirname, '../assets/avatar.png');

  await request(appInstance.getHttpServer())
    .post('/auth/register-company')
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

  const loginResponse = await request(appInstance.getHttpServer())
    .post('/auth/login')
    .send({ email: adminEmail, password: adminPassword })
    .expect(200);

  return loginResponse.body.token;
}
