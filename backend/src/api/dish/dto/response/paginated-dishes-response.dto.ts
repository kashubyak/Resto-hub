import { ApiProperty } from '@nestjs/swagger'
import { BasePaginationDto } from 'src/common/dto/pagination-response.dto'
import { CrateDishWithCategoryResponseDto } from './create-dish-response.dto'

export class PaginatedDishesWithCategoryResponseDto extends BasePaginationDto {
	@ApiProperty({ type: [CrateDishWithCategoryResponseDto] })
	data: CrateDishWithCategoryResponseDto[]
}
