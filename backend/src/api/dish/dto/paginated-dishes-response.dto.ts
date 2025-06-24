import { ApiProperty } from '@nestjs/swagger';
import { DishEntity } from '../entities/dish.entity';

export class PaginatedDishesResponseDto {
  @ApiProperty({ type: [DishEntity] })
  items: DishEntity[];

  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}
