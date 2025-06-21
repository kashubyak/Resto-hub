import { ApiProperty } from '@nestjs/swagger';
import {
  OrderFullEntity,
  OrderIdEntity,
  OrderWithFullDishEntity,
} from '../entities/order-full.entity';

class BasePaginationDto {
  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}

export class PaginatedOrdersResponseDto extends BasePaginationDto {
  @ApiProperty({ type: [OrderFullEntity] })
  data: OrderFullEntity[];
}

export class PaginatedFreeOrdersResponseDto extends BasePaginationDto {
  @ApiProperty({ type: [OrderWithFullDishEntity] })
  data: OrderWithFullDishEntity[];
}

export class PaginatedIdOrdersResponseDto extends BasePaginationDto {
  @ApiProperty({ type: [OrderIdEntity] })
  data: OrderIdEntity[];
}
