import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class DishShortDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class OrderSummaryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  status: OrderStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  total: number;

  @ApiProperty({ type: () => [DishShortDto] })
  dishes: DishShortDto[];

  @ApiProperty()
  waiter: { id: number; name: string };

  @ApiProperty({ required: false })
  cook?: { id: number; name: string } | null;

  @ApiProperty()
  table: { id: number; number: number };
}
