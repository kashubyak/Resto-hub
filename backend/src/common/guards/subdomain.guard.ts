import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SubdomainGuard implements CanActivate {
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

    const isPublic = publicRoutes.some(
      (r) => path.startsWith(r.path) && r.method === method,
    );

    if (isPublic) return true;

    const subdomain = host.split('.')[0];

    if (!subdomain) throw new ForbiddenException('Subdomain is required');

    return true;
  }
}
