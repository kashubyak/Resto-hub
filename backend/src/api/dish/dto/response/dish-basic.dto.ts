import { ApiProperty } from '@nestjs/swagger'

export class DishBasicDto {
	@ApiProperty()
	id!: number

	@ApiProperty()
	name!: string

	@ApiProperty()
	price!: number
}
