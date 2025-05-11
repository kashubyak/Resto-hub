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
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { HttpErrorResponseDto } from 'src/common/dto/http-error.dto';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
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
    type: HttpErrorResponseDto,
  })
  createDish(@Body() dto: CreateDishDto) {
    return this.dishService.createDish(dto);
  }

  @Get()
  @ApiOperation({ description: 'Get a list of all dishes' })
  @ApiOkResponse({
    description: 'A list of all available dishes.',
    type: [DishEntity],
  })
  findAll() {
    return this.dishService.findAll();
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.findOne(id);
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
  assignCategory(
    @Param('id', ParseIntPipe) dishId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.dishService.assignDishToCategory(dishId, categoryId);
  }
}
