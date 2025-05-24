export interface OrderItemEntity {
  dishId: number;
  quantity: number;
  price: number;
  notes?: string;
}

export class OrderEntity {
  constructor(
    public readonly waiterId: number,
    public readonly tableId: number,
    public readonly items: OrderItemEntity[],
  ) {}
}
