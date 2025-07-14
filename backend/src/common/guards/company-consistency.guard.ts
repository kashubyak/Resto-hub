import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { companyIdFromSubdomain } from '../constants';

@Injectable()
export class CompanyConsistencyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const userCompanyId = (request.user as { companyId?: number })?.companyId;
    const subdomainCompanyId = request[companyIdFromSubdomain];

    if (userCompanyId === undefined || subdomainCompanyId === undefined)
      return true;

    if (userCompanyId !== subdomainCompanyId)
      throw new ForbiddenException(
        'Authenticated user does not match subdomain company',
      );
    return true;
  }
}
