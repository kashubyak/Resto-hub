import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsOptional } from 'class-validator';

export enum OrderGroupBy {
  DAY = 'day',
  MONTH = 'month',
  DISH = 'dish',
  CATEGORY = 'category',
  WAITER = 'waiter',
  COOK = 'cook',
  TABLE = 'table',
}

export enum OrderMetric {
  REVENUE = 'revenue',
  COUNT = 'count',
  QUANTITY = 'quantity',
}

export class OrderAnalyticsQueryDto {
  @ApiPropertyOptional({ enum: OrderGroupBy })
  @IsEnum(OrderGroupBy)
  @IsOptional()
  groupBy?: OrderGroupBy;

  @ApiPropertyOptional({ enum: OrderMetric, default: OrderMetric.REVENUE })
  @IsEnum(OrderMetric)
  @IsOptional()
  metric?: OrderMetric = OrderMetric.REVENUE;

  @ApiPropertyOptional({
    description: 'Start date for the analytics query',
    example: '2023-01-01',
  })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({
    description: 'End date for the analytics query',
    example: '2023-01-31',
  })
  @IsDateString()
  @IsOptional()
  to?: string;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @IsArray()
  @Type(() => Number)
  dishIds?: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @IsArray()
  @Type(() => Number)
  categoryIds?: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @IsArray()
  @Type(() => Number)
  waiterIds?: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @IsArray()
  @Type(() => Number)
  cookIds?: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @IsArray()
  @Type(() => Number)
  tableIds?: number[];
}
