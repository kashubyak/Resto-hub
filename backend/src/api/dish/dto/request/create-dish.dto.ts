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
	name!: string

	@ApiPropertyOptional()
	@IsString()
	@IsNotEmpty()
	description!: string

	@ApiPropertyOptional()
	@Transform(({ value }: { value: unknown }) => parseFloat(String(value)))
	@IsNumber()
	@IsPositive()
	price!: number

	@ApiPropertyOptional()
	@IsOptional()
	@Transform(({ value }: { value: unknown }) => parseInt(String(value), 10))
	@IsInt()
	categoryId?: number

	@ApiPropertyOptional()
	@Transform(({ value }: { value: unknown }): string[] => {
		if (Array.isArray(value)) return value as string[]
		if (typeof value === 'string') return value.split(',').map((v) => v.trim())
		return []
	})
	@IsArray()
	@ArrayMinSize(1)
	@IsString({ each: true })
	ingredients!: string[]

	@ApiPropertyOptional()
	@IsOptional()
	@Transform(({ value }: { value: unknown }) => parseFloat(String(value)))
	@IsNumber()
	@IsPositive()
	weightGr?: number

	@ApiPropertyOptional()
	@IsOptional()
	@Transform(({ value }: { value: unknown }) => parseFloat(String(value)))
	@IsNumber()
	@IsPositive()
	calories?: number

	@ApiPropertyOptional()
	@IsOptional()
	@Transform(({ value }: { value: unknown }) => value === 'true')
	@IsBoolean()
	available?: boolean
}
