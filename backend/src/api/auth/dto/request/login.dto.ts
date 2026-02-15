import {
	IsEmail,
	IsOptional,
	IsString,
	Matches,
	MinLength,
} from '@nestjs/class-validator'
import { ApiProperty } from '@nestjs/swagger'

const PASSWORD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

export class LoginDto {
	@ApiProperty({
		description: 'Company subdomain (optional when Host header contains subdomain)',
		example: 'mycompany',
		required: false,
	})
	@IsOptional()
	@IsString()
	subdomain?: string

	@ApiProperty({
		description: 'User email address',
		example: 'admin@company.com',
	})
	@IsEmail()
	email!: string

	@ApiProperty({
		description:
			'User password (min 8 chars, must contain uppercase, lowercase, number, and special character)',
		example: 'Password123!',
	})
	@IsString()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@Matches(PASSWORD_REGEX, {
		message:
			'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
	})
	password!: string
}
