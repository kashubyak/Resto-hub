import { ApiProperty } from '@nestjs/swagger';
import {
  OrderItemWithDishEntity,
  OrderItemWithFullDishEntity,
  OrderTableEntity,
  OrderUserEntity,
} from './order-response.entity';

export class OrderFullEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'PENDING' })
  status: string;

  @ApiProperty({ example: '2025-06-15T12:50:04.136Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-15T12:50:04.136Z' })
  updatedAt: string;

  @ApiProperty({ example: 55.96 })
  total: number;

  @ApiProperty({ type: OrderUserEntity })
  waiter: OrderUserEntity;

  @ApiProperty({ type: OrderUserEntity, nullable: true })
  cook: OrderUserEntity | null;

  @ApiProperty({ type: OrderTableEntity })
  table: OrderTableEntity;

  @ApiProperty({ type: [OrderItemWithDishEntity] })
  orderItems: OrderItemWithDishEntity[];
}

class ShortUser {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Waiter User' })
  name: string;
}

class ShortTable {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  number: number;
}

export class OrderWithFullDishEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'PENDING', enum: ['PENDING', 'COOKING', 'COMPLETE'] })
  status: string;

  @ApiProperty({ example: '2025-06-15T12:50:04.136Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-15T12:50:04.136Z' })
  updatedAt: string;

  @ApiProperty({ example: 55.96 })
  total: number;

  @ApiProperty({ type: ShortUser })
  waiter: ShortUser;

  @ApiProperty({ type: ShortUser, nullable: true })
  cook: ShortUser | null;

  @ApiProperty({ type: ShortTable })
  table: ShortTable;

  @ApiProperty({ type: [OrderItemWithFullDishEntity] })
  orderItems: OrderItemWithFullDishEntity[];
}
