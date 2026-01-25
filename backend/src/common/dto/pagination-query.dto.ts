import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsIn, IsOptional, IsPositive, IsString } from 'class-validator'

export class BasePaginationQueryDto {
	@ApiPropertyOptional({
		description: 'Search term to filter results',
	})
	@IsOptional()
	@IsString()
	search?: string

	@ApiPropertyOptional({
		description: 'Order of sorting, either ascending or descending',
		enum: ['asc', 'desc'],
	})
	@IsOptional()
	@IsIn(['asc', 'desc'])
	order?: 'asc' | 'desc'

	@ApiPropertyOptional({
		description: 'Page number for pagination',
		type: Number,
		default: 1,
	})
	@IsOptional()
	@Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
	@IsPositive()
	page?: number

	@ApiPropertyOptional({
		description: 'Number of items per page for pagination',
		type: Number,
		default: 10,
	})
	@IsOptional()
	@Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
	@IsPositive()
	limit?: number
}
