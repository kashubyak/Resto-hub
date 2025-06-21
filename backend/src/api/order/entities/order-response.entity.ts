import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  orderId: number;

  @ApiProperty({ example: 1 })
  dishId: number;

  @ApiProperty({ example: 1 })
  quantity: number;

  @ApiProperty({ example: 27.98 })
  price: number;

  @ApiProperty({ example: 'More cheese', required: false })
  notes?: string;
}

export class OrderResponseEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  waiterId: number;

  @ApiProperty({ example: null, nullable: true })
  cookId: number | null;

  @ApiProperty({ example: 'PENDING' })
  status: string;

  @ApiProperty({ example: 1 })
  tableId: number;

  @ApiProperty({ example: '2025-06-15T12:50:04.136Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-15T12:50:04.136Z' })
  updatedAt: string;

  @ApiProperty({ type: [OrderItemResponseEntity] })
  orderItems: OrderItemResponseEntity[];
}

export class OrderDishEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Pizza Margherita xxl' })
  name: string;

  @ApiProperty({ example: 10 })
  price: number;
}

export class DishDetailedEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Pizza Margherita xxl' })
  name: string;

  @ApiProperty({ example: 13.99 })
  price: number;

  @ApiProperty({ example: 'pizza pepperoni' })
  description: string;

  @ApiProperty({ example: 'https://example.com/pizza.jpg' })
  imageUrl: string;

  @ApiProperty({ example: ['Tomato', 'Mozzarella', 'Basil'] })
  ingredients: string[];

  @ApiProperty({ example: 300 })
  weightGr: number;

  @ApiProperty({ example: 800 })
  calories: number;

  @ApiProperty({ example: true })
  available: boolean;
}

export class OrderTableEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  number: number;
}

export class OrderUserEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'User worker' })
  name: string;
}

export class OrderItemWithDishEntity {
  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 20 })
  total: number;

  @ApiProperty({ example: 'More cheese', required: false })
  notes?: string;

  @ApiProperty({ type: OrderDishEntity })
  dish: OrderDishEntity;
}

export class OrderItemWithFullDishEntity {
  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 20 })
  total: number;

  @ApiProperty({ example: 'More cheese', required: false })
  notes?: string;

  @ApiProperty({ type: DishDetailedEntity })
  dish: DishDetailedEntity;
}
