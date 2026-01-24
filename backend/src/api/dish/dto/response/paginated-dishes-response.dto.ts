import { ApiProperty } from '@nestjs/swagger'
import { BasePaginationDto } from 'src/common/dto/pagination-response.dto'
import { CreateDishWithCategoryResponseDto } from './create-dish-response.dto'

export class PaginatedDishesWithCategoryResponseDto extends BasePaginationDto {
	@ApiProperty({ type: [CreateDishWithCategoryResponseDto] })
	data: CreateDishWithCategoryResponseDto[]
}
