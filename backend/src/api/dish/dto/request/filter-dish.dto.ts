import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsIn, IsNumber, IsOptional } from 'class-validator'
import { BasePaginationQueryDto } from 'src/common/dto/pagination-query.dto'

export class FilterDishDto extends BasePaginationQueryDto {
	@ApiPropertyOptional({
		description: 'Minimum price to filter dishes',
		example: 10,
	})
	@IsOptional()
	@Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
	@IsNumber({}, { message: 'minPrice must be a number' })
	minPrice?: number

	@ApiPropertyOptional({
		description: 'Maximum price to filter dishes',
		example: 100,
	})
	@IsOptional()
	@Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
	@IsNumber({}, { message: 'maxPrice must be a number' })
	maxPrice?: number

	@ApiPropertyOptional({
		description: 'Filter dishes that are available',
		example: 'true',
	})
	@IsOptional()
	@Transform(({ value }) => value === 'true')
	@IsBoolean()
	available?: boolean

	@ApiPropertyOptional({
		description: 'Sort dishes by a specific field',
		example: 'name',
	})
	@IsOptional()
	@IsIn(['name', 'price', 'createdAt'])
	sortBy?: 'name' | 'price' | 'createdAt'
}
