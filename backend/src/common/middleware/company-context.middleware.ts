import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import { PrismaService } from 'prisma/prisma.service'
import { companyIdFromSubdomain } from '../constants'
import { type IRequestWithCompanyId } from '../interface/request.interface'

@Injectable()
export class CompanyContextMiddleware implements NestMiddleware {
	constructor(private readonly prisma: PrismaService) {}

	async use(req: IRequestWithCompanyId, _res: Response, next: NextFunction) {
		// Skip company lookup for register-company (company does not exist yet)
		if (
			req.path?.includes('register-company') ||
			req.url?.includes('register-company')
		)
			return next()

		const subdomainFromHeader = (req.headers['x-subdomain'] as string)?.trim()
		if (
			subdomainFromHeader &&
			(req.path?.includes('auth/login') || req.url?.includes('auth/login'))
		) {
			const company = await this.prisma.company.findUnique({
				where: { subdomain: subdomainFromHeader },
				select: { id: true },
			})
			if (!company)
				throw new NotFoundException('Company with this subdomain not found')
			req[companyIdFromSubdomain] = company.id
			return next()
		}

		const host =
			(req.headers['x-forwarded-host'] as string) ?? req.hostname ?? ''
		const hostPart = host.split(':')[0] ?? ''
		const subdomain = hostPart.split('.')[0] ?? ''

		if (!subdomain || ['www', 'api', 'localhost', 'lvh'].includes(subdomain))
			return next()

		const company = await this.prisma.company.findUnique({
			where: { subdomain },
			select: { id: true },
		})

		if (!company)
			throw new NotFoundException('Company with this subdomain not found')
		req[companyIdFromSubdomain] = company.id
		next()
	}
}
