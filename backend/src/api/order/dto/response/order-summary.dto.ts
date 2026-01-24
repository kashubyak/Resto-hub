import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { OrderStatus } from '@prisma/client'
import {
	BaseTable,
	BaseUser,
	ExtendedTable,
	ExtendedUser,
	OrderItemSummaryDto,
} from './order-item-summary.dto'

export class OrderSummaryDto {
	@ApiProperty()
	id: number

	@ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
	status: OrderStatus

	@ApiProperty({ example: '2025-06-24T12:00:00.000Z' })
	createdAt: string

	@ApiProperty({ example: '2025-06-24T13:00:00.000Z' })
	updatedAt: string

	@ApiProperty()
	total: number

	@ApiPropertyOptional({ type: BaseUser })
	waiter?: BaseUser

	@ApiPropertyOptional({ type: BaseUser })
	cook?: BaseUser

	@ApiProperty({ type: BaseTable })
	table: BaseTable

	@ApiProperty({ type: [OrderItemSummaryDto] })
	orderItems: OrderItemSummaryDto[]
}

export class OrderSummaryFullPersonalDto {
	@ApiProperty()
	id: number

	@ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
	status: OrderStatus

	@ApiProperty({ example: '2025-06-24T12:00:00.000Z' })
	createdAt: string

	@ApiProperty({ example: '2025-06-24T13:00:00.000Z' })
	updatedAt: string

	@ApiProperty()
	total: number

	@ApiPropertyOptional({ type: ExtendedUser })
	waiter?: ExtendedUser

	@ApiPropertyOptional({ type: ExtendedUser })
	cook?: ExtendedUser

	@ApiProperty({ type: ExtendedTable })
	table: ExtendedTable

	@ApiProperty({ type: [OrderItemSummaryDto] })
	orderItems: OrderItemSummaryDto[]
}
