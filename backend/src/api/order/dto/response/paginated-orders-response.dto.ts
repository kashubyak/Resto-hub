import { ApiProperty } from '@nestjs/swagger'
import { OrderSummaryDto } from './order-summary.dto'

export class BasePaginationDto {
	@ApiProperty({ example: 1 })
	total: number

	@ApiProperty({ example: 1 })
	page: number

	@ApiProperty({ example: 10 })
	limit: number

	@ApiProperty({ example: 1 })
	totalPages: number
}

export class PaginatedOrdersResponseDto extends BasePaginationDto {
	@ApiProperty({ type: [OrderSummaryDto] })
	data: OrderSummaryDto[]
}
