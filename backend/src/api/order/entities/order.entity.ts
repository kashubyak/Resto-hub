export class OrderItemEntity {
  dishId: number;
  quantity: number;
  price: number;
  notes?: string;
}

export class OrderEntity {
  waiterId: number;
  tableId: number;
  items: OrderItemEntity[];
  constructor(waiterId: number, tableId: number, items: OrderItemEntity[]) {
    this.waiterId = waiterId;
    this.tableId = tableId;
    this.items = items;
  }
}
