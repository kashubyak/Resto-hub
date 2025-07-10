import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { FilterCategoryDto } from './dto/request/filter-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import {
  BaseCategoryDto,
  CategorySummaryDto,
} from './dto/response/category-summary.dto';
import { CreateCategoryResponseDto } from './dto/response/create-category-response.dto';
import { PaginatedCategoryResponseDto } from './dto/response/paginated-category-response.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Create a new category (admin only)' })
  @ApiCreatedResponse({
    description: 'The category has been successfully created.',
    type: CreateCategoryResponseDto,
  })
  createCategory(
    @Body() dto: CreateCategoryDto,
    @CurrentUser('companyId') companyId: number,
  ) {
    return this.categoryService.createCategory(dto, companyId);
  }

  @Get()
  @ApiOperation({ description: 'Search and filter categories with pagination' })
  @ApiOkResponse({
    description: 'Filtered and sorted list of categories',
    type: PaginatedCategoryResponseDto,
  })
  getFilterCategories(
    @Query() query: FilterCategoryDto,
    @CurrentUser('companyId') companyId: number,
  ) {
    return this.categoryService.filterCategories(query, companyId);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get a category by ID' })
  @ApiOkResponse({
    description: 'The category has been successfully retrieved.',
    type: CategorySummaryDto,
  })
  getCategoryById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('companyId') companyId: number,
  ) {
    return this.categoryService.getCategoryById(id, companyId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Update a category by ID (admin only)' })
  @ApiOkResponse({
    description: 'The category has been successfully updated.',
    type: BaseCategoryDto,
  })
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser('companyId') companyId: number,
  ) {
    return this.categoryService.updateCategory(id, dto, companyId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ description: 'Delete a category by ID (admin only)' })
  @ApiOkResponse({
    description: 'The category has been successfully deleted.',
    type: BaseCategoryDto,
  })
  deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('companyId') companyId: number,
  ) {
    return this.categoryService.deleteCategory(id, companyId);
  }
}
