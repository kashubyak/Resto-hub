import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { PrismaService } from 'prisma/prisma.service'
import { companyIdFromSubdomain } from '../constants'

@Injectable()
export class CompanyContextMiddleware implements NestMiddleware {
	constructor(private readonly prisma: PrismaService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const host = req.hostname
		const subdomain = host.split('.')[0]

		if (!subdomain || ['www', 'api', 'localhost'].includes(subdomain))
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
