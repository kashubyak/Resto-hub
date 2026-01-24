import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator'
import { BasePaginationQueryDto } from 'src/common/dto/pagination-query.dto'

export class FilterCategoryDto extends BasePaginationQueryDto {
	@ApiPropertyOptional({
		description: 'Filter categories that have dishes',
		example: 'true',
	})
	@IsOptional()
	@Transform(({ value }) => value === 'true')
	@IsBoolean()
	hasDishes?: boolean

	@ApiPropertyOptional({
		description: 'Sort categories by a specific field',
		example: 'name',
	})
	@IsOptional()
	@IsString()
	@IsIn(['name', 'createdAt', 'updatedAt'])
	sortBy?: 'name' | 'createdAt' | 'updatedAt'
}
