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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order-dto';
import { OrdersQueryDto } from './dto/orders-query-dto';
import {
  PaginatedFreeOrdersResponseDto,
  PaginatedOrdersResponseDto,
} from './dto/paginated-orders-response.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderResponseEntity } from './entities/order-response.entity';
import { OrderService } from './order.service';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Roles(Role.WAITER)
  @ApiOperation({ description: 'Create a new order (waiter only)' })
  @ApiBody({ type: CreateOrderDto })
  @ApiCreatedResponse({
    description: 'Order successfully created',
    type: OrderResponseEntity,
  })
  createOrder(
    @CurrentUser('id') waiterId: number,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(waiterId, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ description: 'Receive all orders (admin only)' })
  @ApiQuery({ type: OrdersQueryDto })
  @ApiOkResponse({
    type: PaginatedOrdersResponseDto,
    description: 'Paginated list of orders',
  })
  getAllOrders(@Query() query: OrdersQueryDto) {
    return this.orderService.getAllOrders(query);
  }

  @Get('history')
  @Roles(Role.WAITER, Role.COOK)
  @ApiOperation({
    description: 'Order history (waiter or cook)',
  })
  @ApiQuery({ type: OrdersQueryDto })
  @ApiOkResponse({
    type: PaginatedOrdersResponseDto,
    description: 'Paginated order history for waiter or cook',
  })
  getOrderHistory(
    @CurrentUser('id') userId: number,
    @CurrentUser('role') role: Role,
    @Query() query: OrdersQueryDto,
  ) {
    return this.orderService.getOrderHistory(userId, role, query);
  }

  @Get('free')
  @Roles(Role.COOK)
  @ApiOperation({ description: 'Get free orders (only cook)' })
  @ApiQuery({ type: OrdersQueryDto })
  @ApiOkResponse({
    type: PaginatedFreeOrdersResponseDto,
  })
  getFreeOrders(@Query() query: OrdersQueryDto) {
    return this.orderService.getFreeOrders(query);
  }

  @Get(':id')
  @ApiOperation({ description: 'Receive an order by ID' })
  @ApiParam({ name: 'id', type: Number })
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
  }

  @Patch(':id/assign')
  @Roles(Role.COOK)
  @ApiOperation({ description: 'Assign yourself an order (only the cook)' })
  @ApiParam({ name: 'id', type: Number })
  assignOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @CurrentUser('id') cookId: number,
  ) {
    return this.orderService.assignOrderToCook(orderId, cookId);
  }

  @Patch(':id/cancel')
  @Roles(Role.WAITER)
  @ApiOperation({ description: 'Cancel the order (waiter only)' })
  @ApiParam({ name: 'id', type: Number })
  cancelOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @CurrentUser('id') waiterId: number,
  ) {
    return this.orderService.cancelOrder(orderId, waiterId);
  }

  @Patch(':id/status')
  @ApiOperation({ description: 'Update order status (cook or waiter)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOrderStatusDto })
  @Roles(Role.COOK, Role.WAITER)
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') role: Role,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, userId, role, dto.status);
  }
}
