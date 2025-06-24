import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTableDto } from '../dto/create-table.dto';
import { UpdateTableDto } from '../dto/update-table.dto';

@Injectable()
export class TableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.table.findUnique({ where: { id } });
  }

  async findByNumber(number: number) {
    return this.prisma.table.findUnique({ where: { number } });
  }

  async createTable(dto: CreateTableDto) {
    return this.prisma.table.create({ data: dto });
  }

  async getAllTables() {
    return this.prisma.table.findMany();
  }

  async updateTable(id: number, dto: UpdateTableDto) {
    return this.prisma.table.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTable(id: number) {
    return this.prisma.table.delete({ where: { id } });
  }
}
