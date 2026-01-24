import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Transform } from 'class-transformer'
import {
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
} from 'class-validator'

export class CreateDishDto {
	@ApiPropertyOptional()
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiPropertyOptional()
	@IsString()
	@IsNotEmpty()
	description: string

	@ApiPropertyOptional()
	@Transform(({ value }) => parseFloat(value))
	@IsNumber()
	@IsPositive()
	price: number

	@ApiPropertyOptional()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	@IsInt()
	categoryId?: number

	@ApiPropertyOptional()
	@Transform(({ value }) => {
		if (Array.isArray(value)) return value
		if (typeof value === 'string') return value.split(',').map((v) => v.trim())
		return []
	})
	@IsArray()
	@ArrayMinSize(1)
	@IsString({ each: true })
	ingredients: string[]

	@ApiPropertyOptional()
	@IsOptional()
	@Transform(({ value }) => parseFloat(value))
	@IsNumber()
	@IsPositive()
	weightGr: number

	@ApiPropertyOptional()
	@IsOptional()
	@Transform(({ value }) => parseFloat(value))
	@IsNumber()
	@IsPositive()
	calories: number

	@ApiPropertyOptional()
	@IsOptional()
	@Transform(({ value }) => value === 'true')
	@IsBoolean()
	available?: boolean
}
