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
  ConflictResponseDto,
  HttpErrorResponseDto,
} from 'src/common/dto/http-error.dto';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { FilterDishDto } from './dto/filter-dish.dto';
import { PaginatedDishesResponseDto } from './dto/paginated-dishes-response-dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { DishEntity } from './entities/dish.entity';

@ApiTags('Dishes')
@ApiBearerAuth()
@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post('create')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Create a new dish (admin only)' })
  @ApiCreatedResponse({
    description: 'The dish has been successfully created.',
    type: DishEntity,
  })
  @ApiConflictResponse({
    description: 'Dish with this name already exists.',
    type: ConflictResponseDto,
  })
  createDish(@Body() dto: CreateDishDto) {
    return this.dishService.createDish(dto);
  }

  @Get('search')
  @ApiOperation({ description: 'Search and filter dishes with pagination' })
  @ApiOkResponse({
    description: 'Filtered and sorted list of dishes',
    type: PaginatedDishesResponseDto,
  })
  getFilteredDishes(@Query() query: FilterDishDto) {
    return this.dishService.filterDishes(query);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get a dish by its ID' })
  @ApiOkResponse({
    description: 'Returns the dish with the specified ID.',
    type: DishEntity,
  })
  @ApiNotFoundResponse({
    description: 'Dish with the given ID was not found.',
    type: HttpErrorResponseDto,
  })
  getDishById(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.getDishById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Update a dish by its ID (admin only)' })
  @ApiOkResponse({
    description: 'Dish has been successfully updated.',
    type: CreateDishDto,
  })
  @ApiNotFoundResponse({
    description: 'Dish with the given ID was not found.',
    type: HttpErrorResponseDto,
  })
  updateDish(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDishDto,
  ) {
    return this.dishService.updateDish(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Delete a dish by its ID (admin only)' })
  @ApiOkResponse({
    description: 'Dish has been successfully removed.',
  })
  @ApiNotFoundResponse({
    description: 'Dish with the given ID was not found.',
    type: HttpErrorResponseDto,
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
    type: DishEntity,
  })
  @ApiNotFoundResponse({
    description: 'Dish with the given ID was not found.',
    type: HttpErrorResponseDto,
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
    type: DishEntity,
  })
  @ApiNotFoundResponse({
    description: 'Dish with the given ID was not found.',
    type: HttpErrorResponseDto,
  })
  assignCategory(
    @Param('id', ParseIntPipe) dishId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.dishService.assignDishToCategory(dishId, categoryId);
  }
}
