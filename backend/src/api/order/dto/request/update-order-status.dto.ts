import { ApiProperty } from '@nestjs/swagger'
import { OrderStatus } from '@prisma/client'
import { IsEnum } from 'class-validator'

export class UpdateOrderStatusDto {
	@ApiProperty({ example: 'COMPLETE' })
	@IsEnum(OrderStatus)
	status: OrderStatus
}
