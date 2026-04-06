import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { OrdersQueryDto } from './orders-query.dto'

export enum WaiterOrdersPhase {
	ACTIVE = 'active',
	HISTORY = 'history',
}

export class WaiterMyOrdersQueryDto extends OrdersQueryDto {
	@ApiPropertyOptional({
		enum: WaiterOrdersPhase,
		description:
			'active: non-terminal orders for this waiter; history: FINISHED or CANCELED',
		default: WaiterOrdersPhase.ACTIVE,
	})
	@IsOptional()
	@IsEnum(WaiterOrdersPhase)
	phase?: WaiterOrdersPhase
}
