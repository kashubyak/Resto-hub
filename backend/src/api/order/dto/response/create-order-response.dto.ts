import { ApiProperty } from '@nestjs/swagger'
import { OrderStatus } from '@prisma/client'
import { OrderItemResponseDto } from './order-item-response.dto'

export class CreateOrderResponseDto {
	@ApiProperty()
	id: number

	@ApiProperty()
	waiterId: number

	@ApiProperty({ nullable: true })
	cookId: number | null

	@ApiProperty({ enum: OrderStatus })
	status: OrderStatus

	@ApiProperty()
	tableId: number

	@ApiProperty({ type: [OrderItemResponseDto] })
	orderItems: OrderItemResponseDto[]

	@ApiProperty()
	createdAt: string

	@ApiProperty()
	updatedAt: string
}
