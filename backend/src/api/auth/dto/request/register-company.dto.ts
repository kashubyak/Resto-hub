import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
	IsEmail,
	IsNumber,
	IsString,
	Matches,
	Max,
	Min,
	MinLength,
} from 'class-validator'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

export class RegisterCompanyDto {
	@ApiProperty({ description: 'Company name', example: 'My Restaurant' })
	@IsString()
	name!: string

	@ApiProperty({ description: 'Subdomain for the company', example: 'myrestaurant' })
	@IsString()
	subdomain!: string

	@ApiProperty({ description: 'Company address', example: '123 Main St, Kyiv' })
	@IsString()
	address!: string

	@ApiProperty({ description: 'Latitude', example: 50.4501 })
	@Transform(({ value }) => parseFloat(value as string))
	@IsNumber()
	@Min(-90)
	@Max(90)
	latitude!: number

	@ApiProperty({ description: 'Longitude', example: 30.5234 })
	@Transform(({ value }) => parseFloat(value as string))
	@IsNumber()
	@Min(-180)
	@Max(180)
	longitude!: number

	@ApiProperty({ description: 'Admin full name', example: 'John Doe' })
	@IsString()
	adminName!: string

	@ApiProperty({ description: 'Admin email', example: 'admin@company.com' })
	@IsEmail()
	adminEmail!: string

	@ApiProperty({
		description:
			'Admin password (min 8 chars, must contain uppercase, lowercase, number, and special character)',
		example: 'Password123!',
	})
	@IsString()
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@Matches(PASSWORD_REGEX, {
		message:
			'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
	})
	adminPassword!: string
}
