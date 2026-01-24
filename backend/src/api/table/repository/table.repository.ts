import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { CreateTableDto } from '../dto/request/create-table.dto'
import { UpdateTableDto } from '../dto/request/update-table.dto'
import {
	type IDeleteResult,
	type ITableRepositoryResult,
	type ITableRepositoryResultArray,
	type ITableRepositoryResultOrNull,
} from '../interfaces/repository.interface'

@Injectable()
export class TableRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(
		id: number,
		companyId: number,
	): Promise<ITableRepositoryResultOrNull> {
		return this.prisma.table.findFirst({ where: { id, companyId } })
	}

	async findByNumber(
		number: number,
		companyId: number,
	): Promise<ITableRepositoryResultOrNull> {
		return this.prisma.table.findUnique({
			where: {
				companyId_number: {
					number,
					companyId,
				},
			},
		})
	}

	async createTable(
		dto: CreateTableDto & { companyId: number },
	): Promise<ITableRepositoryResult> {
		return this.prisma.table.create({
			data: dto,
		})
	}

	async getAllTables(companyId: number): Promise<ITableRepositoryResultArray> {
		return this.prisma.table.findMany({ where: { companyId } })
	}

	async updateTable(
		id: number,
		companyId: number,
		dto: UpdateTableDto,
	): Promise<ITableRepositoryResult> {
		return this.prisma.table.update({
			where: { id, companyId },
			data: dto,
		})
	}

	async deleteTable(id: number, companyId: number): Promise<IDeleteResult> {
		await this.prisma.table.delete({
			where: { id, companyId },
		})
		return { id }
	}
}
