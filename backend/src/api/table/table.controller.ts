import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateTableDto } from './dto/create-table-dto';
import { UpdateTableDto } from './dto/update-table-dto';
import { TableEntity } from './entities/table.entity';
import { TableService } from './table.service';

@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post('create')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new table' })
  @ApiResponse({ status: 201, type: TableEntity })
  createTable(@Body() createTableDto: CreateTableDto) {
    return this.tableService.createTable(createTableDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tables' })
  @ApiResponse({ status: 200, type: [TableEntity] })
  getAllTables() {
    return this.tableService.getAllTables();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get table by id' })
  @ApiResponse({ status: 200, type: TableEntity })
  getTableById(@Param('id', ParseIntPipe) id: number) {
    return this.tableService.getTableById(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update table (seats/active)' })
  @ApiResponse({ status: 200, type: TableEntity })
  updateTable(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTableDto,
  ) {
    return this.tableService.updateTable(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete table by id' })
  @ApiResponse({ status: 200, type: TableEntity })
  deleteTable(@Param('id', ParseIntPipe) id: number) {
    return this.tableService.deleteTable(id);
  }
}
