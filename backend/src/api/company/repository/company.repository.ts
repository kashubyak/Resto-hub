import { Injectable } from '@nestjs/common'
import { Company } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { type ICompanyUpdateInput } from '../interfaces/prisma.interface'

@Injectable()
export class CompanyRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(companyId: number): Promise<Company | null> {
		return this.prisma.company.findUnique({
			where: { id: companyId },
		})
	}

	async findByName(name: string): Promise<Company | null> {
		return this.prisma.company.findFirst({
			where: { name },
		})
	}

	async update(
		companyId: number,
		data: ICompanyUpdateInput,
	): Promise<Company> {
		return this.prisma.company.update({
			where: { id: companyId },
			data,
		})
	}

	async deleteCompany(companyId: number): Promise<Company> {
		return this.prisma.company.delete({
			where: { id: companyId },
		})
	}
}
