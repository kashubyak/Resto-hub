import { ApiProperty } from '@nestjs/swagger';
import {
  OrderItemWithDishEntity,
  OrderItemWithFullDishEntity,
} from './order-response.entity';

export class OrderBaseEntity {
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
}

export class BaseUser {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Waiter User' })
  name: string;
}

export class FullUser extends BaseUser {
  @ApiProperty({ example: 'waiter@example.com' })
  email: string;

  @ApiProperty({ example: 'WAITER', enum: ['WAITER', 'COOK'] })
  role: string;
}

export class BaseTable {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  number: number;
}

export class FullTable extends BaseTable {
  @ApiProperty({ example: 2 })
  seats: number;

  @ApiProperty({ example: true })
  active: boolean;
}

export class OrderFullEntity extends OrderBaseEntity {
  @ApiProperty({ type: BaseUser })
  waiter: BaseUser;

  @ApiProperty({ type: BaseUser, nullable: true })
  cook: BaseUser | null;

  @ApiProperty({ type: BaseTable })
  table: BaseTable;

  @ApiProperty({ type: [OrderItemWithDishEntity] })
  orderItems: OrderItemWithDishEntity[];
}

export class OrderWithFullDishEntity extends OrderBaseEntity {
  @ApiProperty({ type: BaseUser })
  waiter: BaseUser;

  @ApiProperty({ type: BaseUser, nullable: true })
  cook: BaseUser | null;

  @ApiProperty({ type: BaseTable })
  table: BaseTable;

  @ApiProperty({ type: [OrderItemWithFullDishEntity] })
  orderItems: OrderItemWithFullDishEntity[];
}

export class OrderIdEntity extends OrderBaseEntity {
  @ApiProperty({ type: FullUser })
  waiter: FullUser;

  @ApiProperty({ type: FullUser, nullable: true })
  cook: FullUser | null;

  @ApiProperty({ type: FullTable })
  table: FullTable;

  @ApiProperty({ type: [OrderItemWithFullDishEntity] })
  orderItems: OrderItemWithFullDishEntity[];
}
