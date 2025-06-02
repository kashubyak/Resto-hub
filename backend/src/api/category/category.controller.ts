import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ConflictResponseDto,
  HttpErrorResponseDto,
} from 'src/common/dto/http-error.dto';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CategoryEntity,
  CreateCategoryEntity,
} from './entities/category.entity';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @Roles('ADMIN')
  @ApiOperation({ description: 'Create a new category' })
  @ApiCreatedResponse({
    description: 'The category has been successfully created.',
    type: CreateCategoryEntity,
  })
  @ApiConflictResponse({
    description: 'Category with this name already exists.',
    type: ConflictResponseDto,
  })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Get('search')
  @ApiOperation({ description: 'Search and filter categories with pagination' })
  @ApiOkResponse({
    description: 'Filtered and sorted list of categories',
    type: [CategoryEntity],
  })
  getFilterCategories(@Query() query: FilterCategoryDto) {
    return this.categoryService.filterCategories(query);
  }

  @ApiOperation({ description: 'Get a category by ID' })
  @ApiOkResponse({
    description: 'The category has been successfully retrieved.',
    type: CreateCategoryEntity,
  })
  @ApiNotFoundResponse({
    description: 'Category with this ID does not exist.',
    type: HttpErrorResponseDto,
  })
  @Get(':id')
  getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @ApiOperation({ description: 'Update a category by ID' })
  @ApiOkResponse({
    description: 'The category has been successfully updated.',
    type: CreateCategoryEntity,
  })
  @ApiNotFoundResponse({
    description: 'Category with the given ID was not found.',
    type: HttpErrorResponseDto,
  })
  @Patch(':id')
  @Roles('ADMIN')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, dto);
  }

  @ApiOperation({ description: 'Delete a category by ID' })
  @ApiOkResponse({
    description: 'The category has been successfully deleted.',
    type: CreateCategoryEntity,
  })
  @ApiNotFoundResponse({
    description: 'Category with the given ID was not found.',
    type: HttpErrorResponseDto,
  })
  @Delete(':id')
  @Roles('ADMIN')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
