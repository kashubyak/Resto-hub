import { ApiProperty } from '@nestjs/swagger';

export class OrderItemEntity {
  @ApiProperty({ example: 1, description: 'ID of the dish' })
  dishId: number;

  @ApiProperty({ example: 2, description: 'Quantity of the dish ordered' })
  quantity: number;

  @ApiProperty({
    example: 199.99,
    description: 'Price of a single dish item at the time of order',
  })
  price: number;

  @ApiProperty({ example: 'No onions, please', required: false })
  notes?: string;
}

export class OrderEntity {
  @ApiProperty({
    example: 5,
    description: 'ID of the waiter who created the order',
  })
  waiterId: number;

  @ApiProperty({
    example: 12,
    description: 'ID of the table assigned to this order',
  })
  tableId: number;

  @ApiProperty({
    type: [OrderItemEntity],
    description: 'List of items in the order',
  })
  items: OrderItemEntity[];

  constructor(waiterId: number, tableId: number, items: OrderItemEntity[]) {
    this.waiterId = waiterId;
    this.tableId = tableId;
    this.items = items;
  }
}
