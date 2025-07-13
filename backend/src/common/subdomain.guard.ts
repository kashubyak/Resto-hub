import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { companyIdFromSubdomain } from './constants';

@Injectable()
export class SubdomainGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const host = request.hostname;
    const path = request.url;
    const method = request.method;

    const publicRoutes = [
      { path: '/auth/login', method: 'POST' },
      { path: '/auth/register-company', method: 'POST' },
      { path: '/auth/refresh', method: 'POST' },
    ];

    if (
      publicRoutes.some((r) => path.startsWith(r.path) && r.method === method)
    )
      return true;

    const subdomain = host.split('.')[0];
    const companyId = request[companyIdFromSubdomain];

    if (!subdomain || !companyId)
      throw new ForbiddenException('Subdomain is required');
    return true;
  }
}
