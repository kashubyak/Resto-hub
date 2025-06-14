import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order-dto';
import { OrdersQueryDto } from './dto/orders-query-dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Roles(Role.WAITER)
  createOrder(
    @CurrentUser('id') waiterId: number,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(waiterId, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  getAllOrders(@Query() query: OrdersQueryDto) {
    return this.orderService.getAllOrders(query);
  }

  @Get('history')
  @Roles(Role.WAITER, Role.COOK)
  getOrderHistory(
    @CurrentUser('id') userId: number,
    @CurrentUser('role') role: Role,
    @Query() query: OrdersQueryDto,
  ) {
    return this.orderService.getOrderHistory(userId, role, query);
  }

  @Get('free')
  @Roles(Role.COOK)
  getFreeOrders(@Query() query: OrdersQueryDto) {
    return this.orderService.getFreeOrders(query);
  }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
  }

  @Patch(':id/assign')
  @Roles(Role.COOK)
  assignOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @CurrentUser('id') cookId: number,
  ) {
    return this.orderService.assignOrderToCook(orderId, cookId);
  }

  @Patch(':id/cancel')
  @Roles(Role.WAITER)
  cancelOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @CurrentUser('id') waiterId: number,
  ) {
    return this.orderService.cancelOrder(orderId, waiterId);
  }

  @Patch(':id/status')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') role: Role,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, userId, role, dto.status);
  }
}
