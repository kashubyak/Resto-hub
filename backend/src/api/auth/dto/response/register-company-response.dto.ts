import { ApiProperty } from '@nestjs/swagger'
import { UserProfileDto } from 'src/common/dto/base-user.dto'

export class RegisterCompanyResponseDto {
	@ApiProperty({ type: UserProfileDto })
	user!: UserProfileDto
}
