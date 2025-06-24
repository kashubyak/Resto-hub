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
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { OrderStatus, Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  OrderAnalyticsQueryDto,
  OrderGroupBy,
  OrderMetric,
} from './dto/order-analytics-query.dto';
import { OrderAnalyticsResponseDto } from './dto/order-analyticsresponse.dto';
import {
  AssignOrderResponseDto,
  CancelOrderResponseDto,
  UpdateOrderStatusResponseDto,
} from './dto/order-response.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import {
  PaginatedFreeOrdersResponseDto,
  PaginatedIdOrdersResponseDto,
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
  @HttpCode(HttpStatus.CREATED)
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

  @Get('analytics')
  @Roles(Role.ADMIN)
  @ApiOperation({
    description:
      'Get order analytics. Returns aggregated analytics data for orders (admin only)',
  })
  @ApiOkResponse({
    description: 'Order analytics data',
    type: OrderAnalyticsResponseDto,
    isArray: true,
  })
  @ApiQuery({ name: 'groupBy', required: false, enum: OrderGroupBy })
  @ApiQuery({ name: 'metric', required: false, enum: OrderMetric })
  @ApiQuery({ name: 'from', required: false, type: String, format: 'date' })
  @ApiQuery({ name: 'to', required: false, type: String, format: 'date' })
  @ApiQuery({ name: 'dishIds', required: false, type: [Number] })
  @ApiQuery({ name: 'categoryIds', required: false, type: [Number] })
  @ApiQuery({ name: 'waiterIds', required: false, type: [Number] })
  @ApiQuery({ name: 'cookIds', required: false, type: [Number] })
  @ApiQuery({ name: 'tableIds', required: false, type: [Number] })
  getOrderAnalytics(@Query() query: OrderAnalyticsQueryDto) {
    return this.orderService.getOrderAnalytics(query);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ description: 'Receive all orders (admin only)' })
  @ApiOkResponse({
    type: PaginatedOrdersResponseDto,
    description: 'Paginated list of orders',
  })
  @ApiQuery({
    name: 'status',
    enum: OrderStatus,
    required: false,
    description: 'Filter by order status',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: 'Filter orders from this date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: 'Filter orders up to this date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'waiterId',
    required: false,
    type: Number,
    description: 'Filter by waiter ID',
  })
  @ApiQuery({
    name: 'cookId',
    required: false,
    type: Number,
    description: 'Filter by cook ID',
  })
  @ApiQuery({
    name: 'tableId',
    required: false,
    type: Number,
    description: 'Filter by table ID',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starting from 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt'],
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort direction',
  })
  getAllOrders(@Query() query: OrdersQueryDto) {
    return this.orderService.getAllOrders(query);
  }

  @Get('history')
  @Roles(Role.WAITER, Role.COOK)
  @ApiOperation({
    description: 'Order history (waiter or cook)',
  })
  @ApiOkResponse({
    type: PaginatedOrdersResponseDto,
    description: 'Paginated order history for waiter or cook',
  })
  @ApiQuery({
    name: 'status',
    enum: OrderStatus,
    required: false,
    description: 'Filter by order status',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: 'Filter from date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: 'Filter to date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'waiterId',
    required: false,
    type: Number,
    description: 'Filter by waiter ID (admin only)',
  })
  @ApiQuery({
    name: 'cookId',
    required: false,
    type: Number,
    description: 'Filter by cook ID (admin only)',
  })
  @ApiQuery({
    name: 'tableId',
    required: false,
    type: Number,
    description: 'Filter by table ID',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starts from 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt'],
    description: 'Sort field (currently only "createdAt")',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort direction',
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
  @ApiOkResponse({
    type: PaginatedFreeOrdersResponseDto,
    description: 'List of free orders available for cooks',
  })
  @ApiQuery({
    name: 'status',
    enum: OrderStatus,
    required: false,
    description: 'Filter by order status',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: 'Filter from date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: 'Filter to date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'waiterId',
    required: false,
    type: Number,
    description: 'Filter by waiter ID',
  })
  @ApiQuery({
    name: 'cookId',
    required: false,
    type: Number,
    description: 'Filter by cook ID',
  })
  @ApiQuery({
    name: 'tableId',
    required: false,
    type: Number,
    description: 'Filter by table ID',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (min 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (min 1)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt'],
    description: 'Sort field (currently only "createdAt")',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  getFreeOrders(@Query() query: OrdersQueryDto) {
    return this.orderService.getFreeOrders(query);
  }

  @Get(':id')
  @ApiOperation({ description: 'Receive an order by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: 'Full information about a single order',
    type: PaginatedIdOrdersResponseDto,
  })
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
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
    @CurrentUser('id') cookId: number,
  ) {
    return this.orderService.assignOrderToCook(orderId, cookId);
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
    @CurrentUser('id') waiterId: number,
  ) {
    return this.orderService.cancelOrder(orderId, waiterId);
  }

  @Patch(':id/status')
  @Roles(Role.COOK, Role.WAITER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Update order status (cook or waiter)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiOkResponse({
    description: 'Updated order status',
    type: UpdateOrderStatusResponseDto,
  })
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('role') role: Role,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, userId, role, dto.status);
  }
}
