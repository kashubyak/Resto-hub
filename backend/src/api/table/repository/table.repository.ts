import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTableDto } from '../dto/request/create-table.dto';
import { UpdateTableDto } from '../dto/request/update-table.dto';

@Injectable()
export class TableRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: number, companyId: number) {
    return this.prisma.table.findFirst({ where: { id, companyId } });
  }

  findByNumber(number: number, companyId: number) {
    return this.prisma.table.findUnique({
      where: {
        companyId_number: {
          number,
          companyId,
        },
      },
    });
  }

  createTable(dto: CreateTableDto & { companyId: number }) {
    return this.prisma.table.create({
      data: dto,
    });
  }

  getAllTables(companyId: number) {
    return this.prisma.table.findMany({ where: { companyId } });
  }

  updateTable(id: number, companyId: number, dto: UpdateTableDto) {
    return this.prisma.table.update({
      where: { id, companyId },
      data: dto,
    });
  }

  deleteTable(id: number, companyId: number) {
    return this.prisma.table.delete({
      where: { id, companyId },
    });
  }
}
