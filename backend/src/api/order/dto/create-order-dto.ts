export class CreateOrderItemDto {
  dishId: number;
  quantity: number;
  notes?: string;
}

export class CreateOrderDto {
  tableId: number;
  items: CreateOrderItemDto[];
}
