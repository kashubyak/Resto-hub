import { ApiProperty } from '@nestjs/swagger';
import {
  OrderFullEntity,
  OrderWithFullDishEntity,
} from '../entities/order-full.entity';

export class PaginatedOrdersResponseDto {
  @ApiProperty({ type: [OrderFullEntity] })
  data: OrderFullEntity[];

  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}

export class PaginatedFreeOrdersResponseDto {
  @ApiProperty({ type: [OrderWithFullDishEntity] })
  data: OrderWithFullDishEntity[];

  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}
