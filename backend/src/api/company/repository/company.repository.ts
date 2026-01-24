import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class CompanyRepository {
	constructor(private readonly prisma: PrismaService) {}

	findById(companyId: number) {
		return this.prisma.company.findUnique({
			where: { id: companyId },
		})
	}
	findByName(name: string) {
		return this.prisma.company.findFirst({
			where: { name },
		})
	}
	update(companyId: number, data: Prisma.CompanyUpdateInput) {
		return this.prisma.company.update({
			where: { id: companyId },
			data,
		})
	}
	deleteCompany(companyId: number) {
		return this.prisma.company.delete({
			where: { id: companyId },
		})
	}
}
