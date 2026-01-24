import { ApiProperty } from '@nestjs/swagger'

export class OrderItemResponseDto {
	@ApiProperty()
	id: number

	@ApiProperty()
	dishId: number

	@ApiProperty()
	quantity: number

	@ApiProperty()
	price: number

	@ApiProperty({ required: false })
	notes?: string

	@ApiProperty()
	orderId: number
}
