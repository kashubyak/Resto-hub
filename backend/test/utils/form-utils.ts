import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { BASE_URL, HOST, logoPath } from './constants';
import { FakeDTO } from './faker';

export const baseCompanyFormFields = (
  req: request.Test,
  data: typeof import('./constants').companyData,
) => {
  return req
    .field('name', data.name)
    .field('subdomain', data.subdomain)
    .field('address', data.address)
    .field('latitude', data.latitude.toString())
    .field('longitude', data.longitude.toString())
    .field('adminName', data.adminName)
    .field('adminEmail', data.adminEmail)
    .field('adminPassword', data.adminPassword);
};
export const attachCompanyFormFields = (
  req: request.Test,
  data: typeof import('./constants').companyData,
) => {
  return req
    .field('name', data.name)
    .field('subdomain', data.subdomain)
    .field('address', data.address)
    .field('latitude', data.latitude.toString())
    .field('longitude', data.longitude.toString())
    .field('adminName', data.adminName)
    .field('adminEmail', data.adminEmail)
    .field('adminPassword', data.adminPassword)
    .attach('logoUrl', logoPath)
    .attach('avatarUrl', logoPath);
};

export const makeRequest = (
  app: INestApplication,
  token: string,
  method: 'get' | 'post' | 'patch' | 'delete',
  url: string,
) => {
  return request(app.getHttpServer())
    [method](url)
    .set('Authorization', `Bearer ${token}`)
    .set('Host', HOST);
};

export const createTable = async (
  app: INestApplication,
  token: string,
  dto = FakeDTO.table.create(),
) => {
  const res = await makeRequest(app, token, 'post', `${BASE_URL.TABLE}/create`)
    .send(dto)
    .expect(201);
  return res.body;
};

export const createCategory = async (
  app: INestApplication,
  token: string,
  dto = FakeDTO.category.create(),
) => {
  const res = await makeRequest(
    app,
    token,
    'post',
    `${BASE_URL.CATEGORY}/create`,
  )
    .send(dto)
    .expect(201);
  return res.body;
};
