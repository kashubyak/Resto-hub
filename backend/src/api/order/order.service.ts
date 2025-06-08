import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order-dto';
import { OrdersQueryDto } from './dto/orders-query-dto';
import { OrderEntity } from './entities/order.entity';
import { OrderRepository } from './repository/order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepo: OrderRepository) {}

  async createOrder(waiterId: number, dto: CreateOrderDto) {
    const dishIds = dto.items.map((item) => item.dishId);
    const priceMap = await this.orderRepo.getDishPrices(dishIds);

    if (priceMap.size !== dishIds.length)
      throw new BadRequestException('Some dishes not found');

    const items = dto.items.map((item) => ({
      dishId: item.dishId,
      quantity: item.quantity,
      price: priceMap.get(item.dishId)! * item.quantity,
      notes: item.notes,
    }));

    const order = new OrderEntity(waiterId, dto.tableId, items);

    return this.orderRepo.createOrder(order);
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

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderRepo.findAll(where, {
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.orderRepo.count(where),
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
        table: order.table,
        orderItems: order.orderItems.map((item) => ({
          price: item.price,
          quantity: item.quantity,
          notes: item.notes,
          dish: item.dish,
        })),
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

  async getOrderHistory(userId: number, role: Role, query: OrdersQueryDto) {
    const where: any = {
      status: {
        in: [OrderStatus.COMPLETE, OrderStatus.DELIVERED, OrderStatus.CANCELED],
      },
    };
    if (role === Role.WAITER) where.waiterId = userId;
    if (role === Role.COOK) where.cookId = userId;

    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderRepo.findAll(where, {
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.orderRepo.count(where),
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
        table: order.table,
        orderItems: order.orderItems.map((item) => ({
          price: item.price,
          quantity: item.quantity,
          notes: item.notes,
          dish: item.dish,
        })),
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

  async getFreeOrders(query: OrdersQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const where = { cookId: null, status: OrderStatus.PENDING };
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderRepo.findWithFullDish(where, {
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.orderRepo.count(where),
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
        table: order.table,
        orderItems: order.orderItems.map((item) => ({
          price: item.price,
          quantity: item.quantity,
          notes: item.notes,
          dish: item.dish,
        })),
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

  async getOrderById(id: number) {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }
}
