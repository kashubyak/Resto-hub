import { Injectable } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table-dto';
import { UpdateTableDto } from './dto/update-table-dto';
import { TableRepository } from './repository/table.repository';

@Injectable()
export class TableService {
  constructor(private readonly tableRepository: TableRepository) {}
  createTable(dto: CreateTableDto) {
    return this.tableRepository.createTable(dto);
  }
  getAllTables() {
    return this.tableRepository.getAllTables();
  }
  getTableById(id: number) {
    return this.tableRepository.getTableById(id);
  }
  updateTable(id: number, dto: UpdateTableDto) {
    return this.tableRepository.updateTable(id, dto);
  }
  deleteTable(id: number) {
    return this.tableRepository.deleteTable(id);
  }
}
