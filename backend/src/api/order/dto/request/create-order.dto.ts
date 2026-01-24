import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	ArrayMinSize,
	IsArray,
	IsInt,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator'

export class CreateOrderItemDto {
	@ApiProperty()
	@IsInt()
	dishId: number

	@ApiProperty()
	@IsInt()
	@Min(1)
	quantity: number

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	notes?: string
}
export class CreateOrderDto {
	@ApiProperty()
	@IsInt()
	tableId: number

	@ApiProperty({ type: [CreateOrderItemDto] })
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateOrderItemDto)
	items: CreateOrderItemDto[]
}
