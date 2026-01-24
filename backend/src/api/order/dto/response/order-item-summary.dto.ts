import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Role } from '@prisma/client'

export class DishInOrderDto {
	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@ApiProperty()
	price: number
}

export class OrderItemSummaryDto {
	@ApiProperty()
	quantity: number

	@ApiProperty()
	total: number

	@ApiPropertyOptional()
	notes?: string

	@ApiProperty({ type: DishInOrderDto })
	dish: DishInOrderDto
}

export class BaseUser {
	@ApiProperty()
	id: number

	@ApiProperty()
	name: string
}

export class ExtendedUser extends BaseUser {
	@ApiProperty()
	email: string

	@ApiProperty({ example: Role.WAITER })
	role: string
}

export class BaseTable {
	@ApiProperty()
	id: number

	@ApiProperty()
	number: number
}

export class ExtendedTable extends BaseTable {
	@ApiProperty()
	seats: number

	@ApiProperty()
	active: boolean
}
