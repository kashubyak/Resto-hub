import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(order: OrderEntity) {
    return this.prisma.order.create({
      data: {
        waiterId: order.waiterId,
        tableId: order.tableId,
        orderItems: {
          create: order.items.map((item) => ({
            dishId: item.dishId,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });
  }

  async getDishPrices(dishIds: number[]) {
    const dishes = await this.prisma.dish.findMany({
      where: { id: { in: dishIds } },
      select: { id: true, price: true },
    });
    const priceMap = new Map<number, number>();
    for (const dish of dishes) priceMap.set(dish.id, dish.price);
    return priceMap;
  }

  async findAll(
    where: any,
    options: { skip: number; take: number; orderBy: any },
  ) {
    return this.prisma.order.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy,
      include: {
        waiter: { select: { id: true, name: true } },
        cook: { select: { id: true, name: true } },
        table: { select: { id: true, number: true } },
        orderItems: {
          select: {
            dish: { select: { id: true, name: true, price: true } },
            quantity: true,
            notes: true,
          },
        },
      },
    });
  }

  async count(where: any) {
    return this.prisma.order.count({ where });
  }

  async findById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        waiter: { select: { id: true, name: true, email: true, role: true } },
        cook: { select: { id: true, name: true, email: true, role: true } },
        table: {
          select: { id: true, number: true, seats: true, active: true },
        },
        orderItems: {
          select: {
            quantity: true,
            notes: true,
            dish: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageUrl: true,
                ingredients: true,
                weightGr: true,
                calories: true,
                available: true,
              },
            },
          },
        },
      },
    });
  }

  async findWithFullDish(
    where: any,
    options: { skip: number; take: number; orderBy: any },
  ) {
    return this.prisma.order.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy,
      include: {
        waiter: { select: { id: true, name: true } },
        cook: { select: { id: true, name: true } },
        table: { select: { id: true, number: true } },
        orderItems: {
          select: {
            dish: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageUrl: true,
                ingredients: true,
                weightGr: true,
                calories: true,
                available: true,
              },
            },
            quantity: true,
            notes: true,
          },
        },
      },
    });
  }
  async findPendingOrderWithCookById(id: number) {
    return await this.prisma.order.findUnique({
      where: { id, status: OrderStatus.PENDING },
      include: { cook: true },
    });
  }

  async findPendingOrderWithWaiterById(id: number) {
    return await this.prisma.order.findUnique({
      where: { id },
      include: { waiter: true },
    });
  }

  async assignCook(orderId: number, cookId: number) {
    return await this.prisma.order.update({
      where: { id: orderId, status: OrderStatus.PENDING },
      data: {
        cookId,
        status: OrderStatus.IN_PROGRESS,
        updatedAt: new Date(),
      },
    });
  }
  async cancelOrder(orderId: number) {
    return await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELED,
        updatedAt: new Date(),
      },
    });
  }

  async updateStatus(orderId: number, status: OrderStatus) {
    return await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
