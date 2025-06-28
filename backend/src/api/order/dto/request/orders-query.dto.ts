import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class OrdersQueryDto {
  @ApiPropertyOptional({
    description: 'Filter orders by status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Filter orders by creation date',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({
    description: 'Filter orders by creation date',
    example: '2023-01-31',
  })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({
    description: 'Filter orders by waiter ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  waiterId?: number;

  @ApiPropertyOptional({
    description: 'Filter orders by cook ID',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cookId?: number;

  @ApiPropertyOptional({
    description: 'Filter orders by table ID',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  tableId?: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit: number;

  @ApiPropertyOptional({
    description: 'Sort orders by a specific field',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt';

  @ApiPropertyOptional({
    description: 'Order of the sorting',
    example: 'asc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
