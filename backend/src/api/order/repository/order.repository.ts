import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(order: OrderEntity) {
    return await this.prisma.order.create({
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
    for (const dish of dishes) {
      priceMap.set(dish.id, dish.price);
    }
    return priceMap;
  }
}
