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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { multerOptions } from 'src/common/s3/file-upload.util';
import { MulterErrorInterceptor } from 'src/common/s3/multer-error.interceptor';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/request/create-dish.dto';
import { FilterDishDto } from './dto/request/filter-dish.dto';
import { UpdateDishDto } from './dto/request/update-dish.dto';
import {
  CrateDishWithCategoryResponseDto,
  CreateDishResponseDto,
} from './dto/response/create-dish-response.dto';
import { PaginatedDishesWithCategoryResponseDto } from './dto/response/paginated-dishes-response.dto';

@ApiTags('Dishes')
@ApiBearerAuth()
@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post('create')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    MulterErrorInterceptor,
    FileInterceptor('imageUrl', multerOptions),
  )
  @ApiOperation({ description: 'Create a new dish (admin only)' })
  @ApiCreatedResponse({
    description: 'The dish has been successfully created.',
    type: CreateDishResponseDto,
  })
  createDish(
    @Body() dto: CreateDishDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.dishService.createDish(dto, file);
  }

  @Get()
  @ApiOperation({ description: 'Search and filter dishes with pagination' })
  @ApiOkResponse({
    description: 'Filtered and sorted list of dishes',
    type: PaginatedDishesWithCategoryResponseDto,
  })
  getFilteredDishes(@Query() query: FilterDishDto) {
    return this.dishService.filterDishes(query);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get a dish by its ID' })
  @ApiOkResponse({
    description: 'Returns the dish with the specified ID.',
    type: CrateDishWithCategoryResponseDto,
  })
  getDishById(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.getDishById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    MulterErrorInterceptor,
    FileInterceptor('imageUrl', multerOptions),
  )
  @ApiOperation({ description: 'Update a dish by its ID (admin only)' })
  @ApiOkResponse({
    description: 'Dish has been successfully updated.',
    type: CreateDishResponseDto,
  })
  updateDish(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateDishDto,
  ) {
    return this.dishService.updateDish(id, dto, file);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Delete a dish by its ID (admin only)' })
  @ApiOkResponse({
    description: 'Dish has been successfully removed.',
    type: CreateDishResponseDto,
  })
  removeDish(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.removeDish(id);
  }

  @Patch(':id/remove-category')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Remove the category from a dish (admin only)' })
  @ApiOkResponse({
    description: 'Category has been successfully removed from the dish.',
    type: CreateDishResponseDto,
  })
  removeCategoryFromDish(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.removeDishFromCategory(id);
  }

  @Patch(':id/assign-category/:categoryId')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Assign an existing category to a dish (admin only)',
  })
  @ApiOkResponse({
    description:
      'Dish has been successfully assigned to the specified category.',
    type: CreateDishResponseDto,
  })
  assignCategory(
    @Param('id', ParseIntPipe) dishId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.dishService.assignDishToCategory(dishId, categoryId);
  }
}
