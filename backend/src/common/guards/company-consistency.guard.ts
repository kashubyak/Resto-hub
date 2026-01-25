import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common'
import { companyIdFromSubdomain } from '../constants'
import { type IRequestWithUser } from '../interface/request.interface'

@Injectable()
export class CompanyConsistencyGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<IRequestWithUser>()
		const userCompanyId = request.user?.companyId
		const subdomainCompanyId = request[companyIdFromSubdomain]

		if (userCompanyId === undefined || subdomainCompanyId === undefined)
			return true

		if (userCompanyId !== subdomainCompanyId)
			throw new ForbiddenException(
				'Authenticated user does not match subdomain company',
			)
		return true
	}
}
