import { ApiProperty } from '@nestjs/swagger'

export class CreateTableResponseDto {
	@ApiProperty()
	id: number

	@ApiProperty()
	number: number

	@ApiProperty()
	seats: number

	@ApiProperty()
	active: boolean

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date
}
