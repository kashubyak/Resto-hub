import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order-dto';
import { OrdersQueryDto } from './dto/orders-query-dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Roles('WAITER')
  createOrder(
    @CurrentUser('id') waiterId: number,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(waiterId, dto);
  }

  @Get()
  @Roles('ADMIN')
  getAllOrders(@Query() query: OrdersQueryDto) {
    return this.orderService.getAllOrders(query);
  }

  @Roles('ADMIN')
  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
  }
}
