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
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ConflictResponseDto,
  HttpErrorResponseDto,
} from 'src/common/dto/http-error.dto';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { FilterDishDto } from './dto/filter-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { DishEntity } from './entities/dish.entity';

@ApiTags('Dishes')
@ApiBearerAuth()
@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post('create')
  @Roles('ADMIN')
  @ApiOperation({ description: 'Create a new dish' })
  @ApiCreatedResponse({
    description: 'The dish has been successfully created.',
    type: DishEntity,
  })
  @ApiConflictResponse({
    description: 'Dish with this name already exists.',
    type: ConflictResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  createDish(@Body() dto: CreateDishDto) {
    return this.dishService.createDish(dto);
  }

  @Get()
  @ApiOperation({ description: 'Get a list of all dishes' })
  @ApiOkResponse({
    description: 'A list of all available dishes.',
    type: [DishEntity],
  })
  @HttpCode(HttpStatus.OK)
  getAllDishes() {
    return this.dishService.getAllDishes();
  }

  @Get('search')
  @ApiOperation({ description: 'Search and filter dishes with pagination' })
  @ApiOkResponse({
    description: 'Filtered and sorted list of dishes',
    type: [DishEntity],
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
  @HttpCode(HttpStatus.OK)
  getDishById(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.getDishById(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ description: 'Update a dish by its ID' })
  @ApiOkResponse({
    description: 'Dish has been successfully updated.',
    type: DishEntity,
  })
  @ApiNotFoundResponse({
    description: 'Dish with the given ID was not found.',
    type: HttpErrorResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  updateDish(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDishDto,
  ) {
    return this.dishService.updateDish(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ description: 'Delete a dish by its ID' })
  @ApiOkResponse({
    description: 'Dish has been successfully removed.',
  })
  @ApiNotFoundResponse({
    description: 'Dish with the given ID was not found.',
    type: HttpErrorResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  removeDish(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.removeDish(id);
  }

  @Patch(':id/remove-category')
  @Roles('ADMIN')
  @ApiOperation({ description: 'Remove the category from a dish' })
  @ApiOkResponse({
    description: 'Category has been successfully removed from the dish.',
    type: DishEntity,
  })
  @ApiNotFoundResponse({
    description: 'Dish with the given ID was not found.',
    type: HttpErrorResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  removeCategoryFromDish(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.removeDishFromCategory(id);
  }

  @Patch(':id/assign-category/:categoryId')
  @Roles('ADMIN')
  @ApiOperation({ description: 'Assign an existing category to a dish' })
  @ApiOkResponse({
    description:
      'Dish has been successfully assigned to the specified category.',
    type: DishEntity,
  })
  @ApiNotFoundResponse({
    description: 'Dish with the given ID was not found.',
    type: HttpErrorResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  assignCategory(
    @Param('id', ParseIntPipe) dishId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.dishService.assignDishToCategory(dishId, categoryId);
  }
}
