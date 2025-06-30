import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { NotificationsGateway } from './gateway/notification.gateway';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './repository/order.repository';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    PrismaService,
    NotificationsGateway,
  ],
})
export class OrderModule {}
