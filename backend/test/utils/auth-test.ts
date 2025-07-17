import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as request from 'supertest';
import { BASE_URL, companyData, HOST, localhost } from './constants';
import { attachCompanyFormFields } from './form-utils';

export async function getAuthToken(
  app: INestApplication,
): Promise<{ token: string; companyId: number }> {
  await attachCompanyFormFields(
    request(app.getHttpServer())
      .post(`${BASE_URL.AUTH}/register-company`)
      .set('Host', localhost),
    companyData,
  ).expect(201);

  const loginRes = await request(app.getHttpServer())
    .post(`${BASE_URL.AUTH}/login`)
    .set('Host', HOST)
    .send({
      email: companyData.adminEmail,
      password: companyData.adminPassword,
    })
    .expect(200);

  const token = loginRes.body.token;

  const prisma = app.get(PrismaService);
  const company = await prisma.company.findUniqueOrThrow({
    where: { subdomain: companyData.subdomain },
    select: { id: true },
  });

  return { token, companyId: company.id };
}
