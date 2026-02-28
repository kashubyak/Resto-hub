import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryResponseDto {
	@ApiProperty()
	id!: number

	@ApiProperty()
	name!: string

	@ApiProperty()
	icon!: string

	@ApiProperty()
	createdAt!: Date

	@ApiProperty()
	updatedAt!: Date
}
