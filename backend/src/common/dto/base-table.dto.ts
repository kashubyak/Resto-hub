import { ApiProperty } from '@nestjs/swagger'

export class BaseTableDto {
	@ApiProperty()
	id!: number

	@ApiProperty()
	number!: number
}

export class ExtendedTableDto extends BaseTableDto {
	@ApiProperty()
	seats!: number

	@ApiProperty()
	active!: boolean
}
