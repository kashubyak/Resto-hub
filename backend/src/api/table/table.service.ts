import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TableRepository } from './repository/table.repository';

@Injectable()
export class TableService {
  constructor(private readonly tableRepo: TableRepository) {}

  async createTable(dto: CreateTableDto) {
    const existing = await this.tableRepo.findByNumber(dto.number);
    if (existing)
      throw new ConflictException('Table with this number already exists');
    return this.tableRepo.createTable(dto);
  }

  async getAllTables() {
    return this.tableRepo.getAllTables();
  }

  async getTableById(id: number) {
    const table = await this.tableRepo.findById(id);
    if (!table) throw new NotFoundException(`Table with id ${id} not found`);
    return table;
  }

  async updateTable(id: number, dto: UpdateTableDto) {
    const table = await this.tableRepo.findById(id);
    if (!table) throw new NotFoundException('Table not found');

    if (dto.number !== undefined) {
      const existingWithSameNumber = await this.tableRepo.findByNumber(
        dto.number,
      );
      if (existingWithSameNumber && existingWithSameNumber.id !== id)
        throw new ConflictException('Table number must be unique');
    }

    return this.tableRepo.updateTable(id, dto);
  }

  async deleteTable(id: number) {
    const table = await this.tableRepo.findById(id);
    if (!table) throw new NotFoundException('Table not found');
    return this.tableRepo.deleteTable(id);
  }
}
