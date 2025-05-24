import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order-dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Roles('WAITER', 'ADMIN')
  async createOrder(
    @CurrentUser('id') waiterId: number,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(waiterId, dto);
  }
}
