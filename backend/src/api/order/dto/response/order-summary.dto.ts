import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { OrderStatus } from '@prisma/client'
import { BaseTableDto, ExtendedTableDto } from 'src/common/dto/base-table.dto'
import { BaseUserDto, ExtendedUserDto } from 'src/common/dto/base-user.dto'
import { OrderItemSummaryDto } from './order-item-summary.dto'

export class OrderSummaryDto {
	@ApiProperty()
	id!: number

	@ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
	status!: OrderStatus

	@ApiProperty({ example: '2025-06-24T12:00:00.000Z' })
	createdAt!: string

	@ApiProperty({ example: '2025-06-24T13:00:00.000Z' })
	updatedAt!: string

	@ApiProperty()
	total!: number

	@ApiPropertyOptional({ type: BaseUserDto })
	waiter?: BaseUserDto

	@ApiPropertyOptional({ type: BaseUserDto })
	cook?: BaseUserDto

	@ApiProperty({ type: BaseTableDto })
	table!: BaseTableDto

	@ApiProperty({ type: [OrderItemSummaryDto] })
	orderItems!: OrderItemSummaryDto[]
}

export class OrderSummaryFullPersonalDto {
	@ApiProperty()
	id!: number

	@ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
	status!: OrderStatus

	@ApiProperty({ example: '2025-06-24T12:00:00.000Z' })
	createdAt!: string

	@ApiProperty({ example: '2025-06-24T13:00:00.000Z' })
	updatedAt!: string

	@ApiProperty()
	total!: number

	@ApiPropertyOptional({ type: ExtendedUserDto })
	waiter?: ExtendedUserDto

	@ApiPropertyOptional({ type: ExtendedUserDto })
	cook?: ExtendedUserDto

	@ApiProperty({ type: ExtendedTableDto })
	table!: ExtendedTableDto

	@ApiProperty({ type: [OrderItemSummaryDto] })
	orderItems!: OrderItemSummaryDto[]
}
