import { ApiPropertyOptional } from '@nestjs/swagger'
import { OrderStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator'
import { BasePaginationQueryDto } from 'src/common/dto/pagination-query.dto'

export class OrdersQueryDto extends BasePaginationQueryDto {
	@ApiPropertyOptional({
		description: 'Filter orders by status',
		enum: OrderStatus,
		example: OrderStatus.PENDING,
	})
	@IsOptional()
	@IsEnum(OrderStatus)
	status?: OrderStatus

	@ApiPropertyOptional({
		description: 'Filter orders by creation date',
		example: '2023-01-01',
	})
	@IsOptional()
	@IsString()
	from?: string

	@ApiPropertyOptional({
		description: 'Filter orders by creation date',
		example: '2023-01-31',
	})
	@IsOptional()
	@IsString()
	to?: string

	@ApiPropertyOptional({
		description: 'Filter orders by waiter ID',
		example: 1,
	})
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	waiterId?: number

	@ApiPropertyOptional({
		description: 'Filter orders by cook ID',
		example: 2,
	})
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	cookId?: number

	@ApiPropertyOptional({
		description: 'Filter orders by table ID',
		example: 3,
	})
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	tableId?: number

	@ApiPropertyOptional({
		description: 'Sort orders by a specific field',
		example: 'createdAt',
	})
	@IsOptional()
	@IsString()
	@IsIn(['createdAt'])
	sortBy?: 'createdAt'
}
