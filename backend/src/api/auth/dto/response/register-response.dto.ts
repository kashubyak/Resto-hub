import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@prisma/client'

class UserResponse {
	@ApiProperty()
	id: number

	@ApiProperty()
	name: string

	@ApiProperty()
	email: string

	@ApiProperty({ enum: Role, example: Role.WAITER })
	role: Role

	@ApiProperty()
	avatarUrl: string
}

export class RegisterResponseDto {
	@ApiProperty({ description: 'JWT access token' })
	access_token: string

	@ApiProperty({ type: () => UserResponse })
	user: UserResponse
}
