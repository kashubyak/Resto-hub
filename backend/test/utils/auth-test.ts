import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function getAuthToken(
  appInstance: INestApplication,
  credentials: {
    email: string;
    password: string;
    name?: string;
    role?: string;
  },
): Promise<string> {
  const { email, password, name, role } = credentials;
  await request(appInstance.getHttpServer())
    .post('/auth/register')
    .send({ email, password, name, role })
    .expect(201);

  const loginResponse = await request(appInstance.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  return loginResponse.body.token;
}
