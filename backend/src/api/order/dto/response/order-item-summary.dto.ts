import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DishBasicDto } from 'src/api/dish/dto/response/dish-basic.dto'
import { BaseTableDto, ExtendedTableDto } from 'src/common/dto/base-table.dto'
import { BaseUserDto, ExtendedUserDto } from 'src/common/dto/base-user.dto'

export class OrderItemSummaryDto {
	@ApiProperty()
	price!: number

	@ApiProperty()
	quantity!: number

	@ApiProperty()
	total!: number

	@ApiPropertyOptional()
	notes?: string

	@ApiProperty({ type: DishBasicDto })
	dish!: DishBasicDto
}

export { BaseTableDto, BaseUserDto, DishBasicDto, ExtendedTableDto, ExtendedUserDto }

