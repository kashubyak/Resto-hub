import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTableDto } from '../dto/request/create-table.dto';
import { UpdateTableDto } from '../dto/request/update-table.dto';

@Injectable()
export class TableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number, companyId: number) {
    return this.prisma.table.findUnique({ where: { id, companyId } });
  }

  async findByNumber(number: number, companyId: number) {
    return this.prisma.table.findUnique({
      where: {
        companyId_number: {
          number,
          companyId,
        },
      },
    });
  }

  async createTable(dto: CreateTableDto & { companyId: number }) {
    return this.prisma.table.create({
      data: dto,
    });
  }

  async getAllTables(companyId: number) {
    return this.prisma.table.findMany({ where: { companyId } });
  }

  async updateTable(id: number, dto: UpdateTableDto, companyId: number) {
    return this.prisma.table.update({
      where: { id, companyId },
      data: dto,
    });
  }

  async deleteTable(id: number, companyId: number) {
    return this.prisma.table.delete({ where: { id, companyId } });
  }
}
