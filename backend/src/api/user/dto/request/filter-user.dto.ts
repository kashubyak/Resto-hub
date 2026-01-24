import { ApiPropertyOptional } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsIn, IsOptional, IsPositive, IsString } from 'class-validator'

export class FilterUserDto {
	@ApiPropertyOptional({
		description: 'Search users by name or email',
	})
	@IsOptional()
	@IsString()
	search?: string

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
	sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt'

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
	@Transform(({ value }) => parseInt(value, 10))
	@IsPositive()
	page?: number

	@ApiPropertyOptional({
		description: 'Number of users per page for pagination',
		type: Number,
		default: 10,
	})
	@IsOptional()
	@Transform(({ value }) => parseInt(value, 10))
	@IsPositive()
	limit?: number
}
