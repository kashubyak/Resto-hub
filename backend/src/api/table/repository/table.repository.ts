import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTableDto } from '../dto/create-table-dto';
import { UpdateTableDto } from '../dto/update-table-dto';

@Injectable()
export class TableRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createTable(dto: CreateTableDto) {
    return await this.prismaService.table.create({
      data: dto,
    });
  }
  async getAllTables() {
    return await this.prismaService.table.findMany();
  }
  async getTableById(id: number) {
    const table = await this.prismaService.table.findUnique({ where: { id } });
    if (!table) {
      throw new NotFoundException(`Table with id ${id} not found`);
    }
    return table;
  }

  async updateTable(id: number, dto: UpdateTableDto) {
    const existing = await this.prismaService.table.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Table not found');

    try {
      return await this.prismaService.table.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Table number must be unique');
      }
      throw error;
    }
  }
  async deleteTable(id: number) {
    return await this.prismaService.table.delete({ where: { id } });
  }
}
