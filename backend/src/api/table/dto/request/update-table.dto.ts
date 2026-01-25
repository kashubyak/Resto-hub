import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator'

export class UpdateTableDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	@IsPositive()
	number?: number

	@ApiPropertyOptional()
	@IsOptional()
	@IsInt()
	@IsPositive()
	seats?: number

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	active?: boolean
}
