import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Company } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { company_avatar } from 'src/common/constants'
import { type IOptionalFile } from 'src/common/interface/file-upload.interface'
import { S3Service } from 'src/common/s3/s3.service'
import { UpdateCompanyDto } from './dto/request/update-company.dto'
import { type ICompanyUpdateInput } from './interfaces/prisma.interface'
import { CompanyRepository } from './repository/company.repository'

@Injectable()
export class CompanyService {
	constructor(
		private readonly companyRepository: CompanyRepository,
		private readonly s3Service: S3Service,
		private readonly prisma: PrismaService,
	) {}

	async getCompanyById(companyId: number): Promise<Company> {
		const company = await this.companyRepository.findById(companyId)
		if (!company)
			throw new NotFoundException(`Company with ID ${companyId} not found`)
		return company
	}

	async updateCompany(
		companyId: number,
		dto: UpdateCompanyDto,
		file?: IOptionalFile,
	): Promise<Company> {
		const company = await this.companyRepository.findById(companyId)
		if (!company)
			throw new NotFoundException(`Company with ID ${companyId} not found`)

		if (dto.name && dto.name !== company.name) {
			const existing = await this.companyRepository.findByName(dto.name)
			if (existing)
				throw new ConflictException(
					`Company with name ${dto.name} already exists`,
				)
		}

		let logoUrl = company.logoUrl
		if (file) {
			await this.s3Service.deleteFile(logoUrl)
			logoUrl = await this.s3Service.uploadFile(file, company_avatar)
		}

		const latitudeDefined = dto.latitude !== undefined
		const longitudeDefined = dto.longitude !== undefined
		if (latitudeDefined !== longitudeDefined)
			throw new ConflictException(
				'Both latitude and longitude must be provided together',
			)

		const updateData: ICompanyUpdateInput = {
			logoUrl,
		}
		if (dto.name !== undefined) updateData.name = dto.name
		if (dto.address !== undefined) updateData.address = dto.address

		if (latitudeDefined && longitudeDefined) {
			const latitude = dto.latitude
			const longitude = dto.longitude
			if (latitude !== undefined && longitude !== undefined) {
				updateData.latitude = latitude
				updateData.longitude = longitude
			}
		}

		return this.companyRepository.update(companyId, updateData)
	}

	async deleteCompany(companyId: number): Promise<Company> {
		const company = await this.companyRepository.findById(companyId)
		if (!company)
			throw new NotFoundException(`Company with ID ${companyId} not found`)

		await this.s3Service.deleteFile(company.logoUrl)
		await this.prisma.$transaction([
			this.prisma.order.deleteMany({ where: { companyId } }),
			this.prisma.dish.deleteMany({ where: { companyId } }),
			this.prisma.category.deleteMany({ where: { companyId } }),
			this.prisma.table.deleteMany({ where: { companyId } }),
			this.prisma.user.deleteMany({ where: { companyId } }),
			this.prisma.company.delete({ where: { id: companyId } }),
		])
		return company
	}
}
