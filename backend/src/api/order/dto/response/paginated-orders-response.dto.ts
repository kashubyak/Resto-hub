import { ApiProperty } from '@nestjs/swagger'
import { BasePaginationDto } from 'src/common/dto/pagination-response.dto'
import { OrderSummaryDto } from './order-summary.dto'

export class PaginatedOrdersResponseDto extends BasePaginationDto {
	@ApiProperty({ type: [OrderSummaryDto] })
	data!: OrderSummaryDto[]
}
