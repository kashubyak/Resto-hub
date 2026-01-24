import { ApiProperty } from '@nestjs/swagger'
import { UserProfileDto } from 'src/common/dto/base-user.dto'

export class RegisterResponseDto {
	@ApiProperty({ description: 'JWT access token' })
	access_token!: string

	@ApiProperty({ type: () => UserProfileDto })
	user!: UserProfileDto
}
