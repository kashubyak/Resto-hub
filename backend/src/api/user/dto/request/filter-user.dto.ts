import { ApiPropertyOptional } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { IsIn, IsOptional } from 'class-validator'
import { BasePaginationQueryDto } from 'src/common/dto/pagination-query.dto'
import { type ICommonSortFields } from 'src/common/interface/prisma.interface'

export class FilterUserDto extends BasePaginationQueryDto {
	@ApiPropertyOptional({
		description: 'Filter users by role',
		enum: [Role.COOK, Role.WAITER],
	})
	@IsOptional()
	@IsIn([Role.COOK, Role.WAITER])
	role?: Role

	@ApiPropertyOptional({
		description: 'Sort users by a specific field',
		enum: ['name', 'email', 'createdAt', 'updatedAt'],
	})
	@IsOptional()
	@IsIn(['name', 'email', 'createdAt', 'updatedAt'])
	sortBy?: 'name' | 'email' | ICommonSortFields
}
