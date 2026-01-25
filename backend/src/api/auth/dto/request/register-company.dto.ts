import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
	IsEmail,
	IsNumber,
	IsString,
	Max,
	Min,
	MinLength,
} from 'class-validator'

export class RegisterCompanyDto {
	@ApiProperty({ description: 'Company name' })
	@IsString()
	name!: string

	@ApiProperty({ description: 'Subdomain for the company' })
	@IsString()
	subdomain!: string

	@ApiProperty({ description: 'Company address' })
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

	@ApiProperty({ description: 'Admin full name' })
	@IsString()
	adminName!: string

	@ApiProperty({ description: 'Admin email' })
	@IsEmail()
	adminEmail!: string

	@ApiProperty({ description: 'Admin password (min 6 characters)' })
	@IsString()
	@MinLength(6)
	adminPassword!: string
}
