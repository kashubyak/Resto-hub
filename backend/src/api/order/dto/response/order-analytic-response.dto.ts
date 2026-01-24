import { ApiProperty } from '@nestjs/swagger'

class TrendPointDto {
	@ApiProperty()
	date: string

	@ApiProperty()
	value: number
}

class GroupInfoDto {
	@ApiProperty({ required: false })
	id?: number

	@ApiProperty({ required: false })
	name?: string

	@ApiProperty({ required: false })
	category?: string

	@ApiProperty({ required: false })
	categoryId?: number
}

export class OrderAnalyticsResponseDto {
	@ApiProperty()
	group: string

	@ApiProperty({ type: GroupInfoDto })
	groupInfo: GroupInfoDto

	@ApiProperty()
	value: number

	@ApiProperty()
	count: number

	@ApiProperty()
	quantity: number

	@ApiProperty()
	revenue: number

	@ApiProperty()
	avgRevenuePerOrder: number

	@ApiProperty()
	avgItemsPerOrder: number

	@ApiProperty()
	percentageOfTotalRevenue: number

	@ApiProperty()
	maxRevenueInDay: number

	@ApiProperty()
	minRevenueInDay: number

	@ApiProperty()
	peakDay: string

	@ApiProperty()
	troughDay: string

	@ApiProperty({ type: [TrendPointDto] })
	trend: TrendPointDto[]
}
