import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order-dto';
import { OrderEntity } from './entities/order.entity';
import { OrderRepository } from './repository/order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
  async createOrder(waiterId: number, dto: CreateOrderDto) {
    const dishIds = dto.items.map((item) => item.dishId);
    const priceMap = await this.orderRepository.getDishPrices(dishIds);
    const items = dto.items.map((item) => {
      const price = priceMap.get(item.dishId);
      if (!price) {
        throw new Error(`Dish with ID ${item.dishId} not found`);
      }
      return {
        dishId: item.dishId,
        quantity: item.quantity,
        price: price * item.quantity,
        notes: item.notes,
      };
    });
    const order = new OrderEntity(waiterId, dto.tableId, items);
    return this.orderRepository.createOrder(order);
  }
}
