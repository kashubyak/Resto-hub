import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order-dto';
import { OrdersQueryDto } from './dto/orders-query-dto';
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

  async getAllOrders(query: OrdersQueryDto) {
    const {
      status,
      from,
      to,
      waiterId,
      cookId,
      tableId,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const where: any = {};
    if (status) where.status = status;
    if (waiterId) where.waiterId = waiterId;
    if (cookId) where.cookId = cookId;
    if (tableId) where.tableId = tableId;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [orders, total] = await Promise.all([
      this.orderRepository.findAll(where, {
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.orderRepository.count(where),
    ]);

    const summarizedOrders = orders.map((order) => {
      const total = order.orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      return {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        total,
        waiter: order.waiter,
        cook: order.cook,
        table: order.Table,
        dishes: order.orderItems.map((item) => item.dish),
      };
    });

    return {
      data: summarizedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
