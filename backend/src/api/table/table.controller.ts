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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateTableDto } from './dto/request/create-table.dto';
import { UpdateTableDto } from './dto/request/update-table.dto';
import { CreateTableResponseDto } from './dto/response/create-table-response.dto';
import { TableService } from './table.service';

@ApiTags('Tables')
@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post('create')
  @Roles(Role.ADMIN)
  @ApiOperation({ description: 'Create a new table (admin only)' })
  @ApiCreatedResponse({
    description: 'Table created successfully',
    type: CreateTableResponseDto,
  })
  createTable(
    @Body() createTableDto: CreateTableDto,
    @CurrentUser('companyId') companyId: number,
  ) {
    return this.tableService.createTable(createTableDto, companyId);
  }

  @Get()
  @ApiOperation({ description: 'Get all tables' })
  @ApiOkResponse({
    description: 'List of all tables',
    type: [CreateTableResponseDto],
  })
  getAllTables(@CurrentUser('companyId') companyId: number) {
    return this.tableService.getAllTables(companyId);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get table by ID' })
  @ApiOkResponse({
    description: 'Table found',
    type: CreateTableResponseDto,
  })
  getTableById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('companyId') companyId: number,
  ) {
    return this.tableService.getTableById(id, companyId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    description: 'Update table (number, seats, active) (admin only)',
  })
  @ApiOkResponse({
    description: 'Table updated successfully',
    type: CreateTableResponseDto,
  })
  updateTable(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTableDto,
    @CurrentUser('companyId') companyId: number,
  ) {
    return this.tableService.updateTable(id, dto, companyId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ description: 'Delete table by ID (admin only)' })
  @ApiOkResponse({
    description: 'Table deleted successfully',
    type: CreateTableResponseDto,
  })
  deleteTable(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('companyId') companyId: number,
  ) {
    return this.tableService.deleteTable(id, companyId);
  }
}
