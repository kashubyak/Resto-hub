import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@prisma/client'

export class BaseUserDto {
	@ApiProperty()
	id!: number

	@ApiProperty()
	name!: string
}

export class ExtendedUserDto extends BaseUserDto {
	@ApiProperty()
	email!: string

	@ApiProperty({ enum: Role, example: Role.WAITER })
	role!: Role
}

export class UserProfileDto extends ExtendedUserDto {
	@ApiProperty()
	avatarUrl!: string
}

export class UserRecordDto extends UserProfileDto {
	@ApiProperty()
	createdAt!: Date

	@ApiProperty()
	updatedAt!: Date
}
