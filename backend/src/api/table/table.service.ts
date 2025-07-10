import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTableDto } from './dto/request/create-table.dto';
import { UpdateTableDto } from './dto/request/update-table.dto';
import { TableRepository } from './repository/table.repository';

@Injectable()
export class TableService {
  constructor(private readonly tableRepo: TableRepository) {}

  async createTable(dto: CreateTableDto, companyId: number) {
    const existing = await this.tableRepo.findByNumber(dto.number, companyId);
    if (existing)
      throw new ConflictException('Table with this number already exists');

    return this.tableRepo.createTable({ ...dto, companyId });
  }

  async getAllTables(companyId: number) {
    return this.tableRepo.getAllTables(companyId);
  }

  async getTableById(id: number, companyId: number) {
    const table = await this.tableRepo.findById(id, companyId);
    if (!table) throw new NotFoundException(`Table with id ${id} not found`);
    return table;
  }

  async updateTable(id: number, dto: UpdateTableDto, companyId: number) {
    const table = await this.tableRepo.findById(id, companyId);
    if (!table) throw new NotFoundException('Table not found');
    if (dto.number !== undefined) {
      const existingWithSameNumber = await this.tableRepo.findByNumber(
        dto.number,
        companyId,
      );
      if (existingWithSameNumber && existingWithSameNumber.id !== id)
        throw new ConflictException('Table number must be unique');
    }

    return this.tableRepo.updateTable(id, companyId, dto);
  }

  async deleteTable(id: number, companyId: number) {
    const table = await this.tableRepo.findById(id, companyId);
    if (!table) throw new NotFoundException('Table not found');
    if (table.active === false)
      throw new ConflictException('Cannot delete an occupied table');
    return this.tableRepo.deleteTable(id, companyId);
  }
}
