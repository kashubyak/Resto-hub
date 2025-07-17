import * as request from 'supertest';
import { logoPath } from './constants';

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
