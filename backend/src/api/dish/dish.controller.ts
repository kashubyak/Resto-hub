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
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
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
  @ApiCreatedResponse({
    description: 'The dish has been successfully created.',
    type: DishEntity,
  })
  createDish(@Body() dto: CreateDishDto) {
    return this.dishService.createDish(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'A list of all dishes.', type: [DishEntity] })
  findAll() {
    return this.dishService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Information about the dish.',
    type: DishEntity,
  })
  @ApiNotFoundResponse({ description: 'Dish not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOkResponse({
    description: 'The dish has been successfully updated.',
    type: DishEntity,
  })
  @ApiNotFoundResponse({ description: 'Dish not found.' })
  updateDish(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDishDto,
  ) {
    return this.dishService.updateDish(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOkResponse({ description: 'The dish has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Dish not found.' })
  removeDish(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.removeDish(id);
  }

  @Patch(':id/remove-category')
  @Roles('ADMIN')
  @ApiOkResponse({ description: 'Category removed from dish.' })
  @ApiNotFoundResponse({ description: 'Dish not found.' })
  removeCategoryFromDish(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.removeDishFromCategory(id);
  }

  @Patch(':id/assign-category/:categoryId')
  @Roles('ADMIN')
  @ApiOkResponse({ description: 'Dish assigned to category.' })
  @ApiNotFoundResponse({ description: 'Dish not found.' })
  assignCategory(
    @Param('id', ParseIntPipe) dishId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.dishService.assignDishToCategory(dishId, categoryId);
  }
}
