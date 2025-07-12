import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { OrderAnalyticsQueryDto } from './dto/request/order-analytics-query.dto';
import { OrdersQueryDto } from './dto/request/orders-query.dto';
import { UpdateOrderStatusDto } from './dto/request/update-order-status.dto';
import { CreateOrderResponseDto } from './dto/response/create-order-response.dto';
import { OrderAnalyticsResponseDto } from './dto/response/order-analytic-response.dto';
import {
  AssignOrderResponseDto,
  CancelOrderResponseDto,
  UpdateOrderStatusResponseDto,
} from './dto/response/order-response.dto';
import { OrderSummaryFullPersonalDto } from './dto/response/order-summary.dto';
import { PaginatedOrdersResponseDto } from './dto/response/paginated-orders-response.dto';
import { OrderService } from './order.service';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Roles(Role.WAITER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Create a new order (waiter only)' })
  @ApiCreatedResponse({
    description: 'Order successfully created',
    type: CreateOrderResponseDto,
  })
  createOrder(
    @CurrentUser('id') waiterId: number,
    @Body() dto: CreateOrderDto,
    @CurrentUser('companyId') companyId: number,
  ) {
    return this.orderService.createOrder(waiterId, dto, companyId);
  }

  @Get('analytics')
  @Roles(Role.ADMIN)
  @ApiOperation({
    description:
      'Get order analytics. Returns aggregated analytics data for orders (admin only)',
  })
  @ApiOkResponse({
    description: 'Order analytics data',
    type: [OrderAnalyticsResponseDto],
  })
  getOrderAnalytics(@Query() query: OrderAnalyticsQueryDto) {
    return this.orderService.getOrderAnalytics(query);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ description: 'Receive all orders (admin only)' })
  @ApiOkResponse({
    description: 'Paginated list of orders',
    type: PaginatedOrdersResponseDto,
  })
  getAllOrders(
    @Query() query: OrdersQueryDto,
    @CurrentUser('companyId') companyId: number,
  ) {
    return this.orderService.getAllOrders(query, companyId);
  }

  @Get('history')
  @Roles(Role.WAITER, Role.COOK)
  @ApiOperation({
    description: 'Order history (waiter or cook)',
  })
  @ApiOkResponse({
    description: 'Paginated list of orders for the user',
    type: PaginatedOrdersResponseDto,
  })
  getOrderHistory(@CurrentUser() user: User, @Query() query: OrdersQueryDto) {
    return this.orderService.getOrderHistory(
      user.id,
      user.role,
      query,
      user.companyId,
    );
  }

  @Get('free')
  @Roles(Role.COOK)
  @ApiOperation({ description: 'Get free orders cook = null (only cook)' })
  @ApiOkResponse({
    description: 'List of free orders available for cooks',
    type: PaginatedOrdersResponseDto,
  })
  getFreeOrders(
    @Query() query: OrdersQueryDto,
    @CurrentUser('companyId') companyId: number,
  ) {
    return this.orderService.getFreeOrders(query, companyId);
  }

  @Get(':id')
  @ApiOperation({ description: 'Receive an order by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: 'Full information about a single order',
    type: OrderSummaryFullPersonalDto,
  })
  getOrderById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('companyId') companyId: number,
  ) {
    return this.orderService.getOrderById(id, companyId);
  }

  @Patch(':id/assign')
  @Roles(Role.COOK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Assign yourself an order (only cook)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: 'Order assigned to cook',
    type: AssignOrderResponseDto,
  })
  assignOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @CurrentUser() user: User,
  ) {
    return this.orderService.assignOrderToCook(
      orderId,
      user.id,
      user.companyId,
    );
  }

  @Patch(':id/cancel')
  @Roles(Role.WAITER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Cancel the order (waiter only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: 'Order canceled',
    type: CancelOrderResponseDto,
  })
  cancelOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @CurrentUser() user: User,
  ) {
    return this.orderService.cancelOrder(orderId, user.id, user.companyId);
  }

  @Patch(':id/status')
  @Roles(Role.COOK, Role.WAITER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Update order status (cook or waiter)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: 'Updated order status',
    type: UpdateOrderStatusResponseDto,
  })
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(
      id,
      user.id,
      user.role,
      dto.status,
      user.companyId,
    );
  }
}
