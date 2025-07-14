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
  companyId: number;
  constructor(
    waiterId: number,
    tableId: number,
    items: OrderItemEntity[],
    companyId: number,
  ) {
    this.waiterId = waiterId;
    this.tableId = tableId;
    this.items = items;
    this.companyId = companyId;
  }
}
