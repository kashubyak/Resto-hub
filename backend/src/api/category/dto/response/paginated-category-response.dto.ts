import { ApiProperty } from '@nestjs/swagger'
import { BasePaginationDto } from 'src/common/dto/pagination-response.dto'
import { CategorySummaryDto } from './category-summary.dto'

export class PaginatedCategoryResponseDto extends BasePaginationDto {
	@ApiProperty({ type: [CategorySummaryDto] })
	data: CategorySummaryDto[]
}
