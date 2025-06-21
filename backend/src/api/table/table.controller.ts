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
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  BadRequestResponseDto,
  ConflictResponseDto,
  HttpErrorResponseDto,
} from 'src/common/dto/http-error.dto';
import { CreateTableDto } from './dto/create-table-dto';
import { UpdateTableDto } from './dto/update-table-dto';
import { TableEntity } from './entities/table.entity';
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
    type: TableEntity,
  })
  @ApiConflictResponse({
    description: 'Table with the same number already exists',
    type: ConflictResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error in body payload',
    type: BadRequestResponseDto,
  })
  createTable(@Body() createTableDto: CreateTableDto) {
    return this.tableService.createTable(createTableDto);
  }

  @Get()
  @ApiOperation({ description: 'Get all tables' })
  @ApiOkResponse({
    description: 'List of all tables',
    type: [TableEntity],
  })
  getAllTables() {
    return this.tableService.getAllTables();
  }

  @Get(':id')
  @ApiOperation({ description: 'Get table by ID' })
  @ApiOkResponse({
    description: 'Table found',
    type: TableEntity,
  })
  @ApiNotFoundResponse({
    description: 'Table with specified ID was not found',
    type: HttpErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID parameter (must be a number)',
    type: BadRequestResponseDto,
  })
  getTableById(@Param('id', ParseIntPipe) id: number) {
    return this.tableService.getTableById(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    description: 'Update table (number, seats, active) (admin only)',
  })
  @ApiOkResponse({
    description: 'Table updated successfully',
    type: TableEntity,
  })
  @ApiNotFoundResponse({
    description: 'Table with specified ID was not found',
    type: HttpErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error in body or ID parameter',
    type: BadRequestResponseDto,
  })
  @ApiConflictResponse({
    description: 'Updated table number conflicts with another existing table',
    type: ConflictResponseDto,
  })
  updateTable(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTableDto,
  ) {
    return this.tableService.updateTable(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ description: 'Delete table by ID (admin only)' })
  @ApiOkResponse({
    description: 'Table deleted successfully',
    type: TableEntity,
  })
  @ApiNotFoundResponse({
    description: 'Table with specified ID was not found',
    type: HttpErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID parameter (must be a number)',
    type: BadRequestResponseDto,
  })
  deleteTable(@Param('id', ParseIntPipe) id: number) {
    return this.tableService.deleteTable(id);
  }
}
