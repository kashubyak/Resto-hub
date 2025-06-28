import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class AssignOrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  waiterId: number;

  @ApiProperty()
  cookId: number;

  @ApiProperty({
    example: OrderStatus.IN_PROGRESS,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETE'],
  })
  status: OrderStatus;

  @ApiProperty()
  tableId: number;

  @ApiProperty({ example: '2025-06-16T08:59:04.292Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-16T13:44:13.152Z' })
  updatedAt: string;
}

export class CancelOrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  waiterId: number;

  @ApiProperty({ nullable: true })
  cookId: number | null;

  @ApiProperty({
    example: OrderStatus.CANCELED,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETE', 'CANCELED'],
  })
  status: OrderStatus;

  @ApiProperty()
  tableId: number;

  @ApiProperty({ example: '2025-06-16T08:32:24.116Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-16T15:28:35.005Z' })
  updatedAt: string;
}

export class UpdateOrderStatusResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  waiterId: number;

  @ApiProperty({ nullable: true })
  cookId: number | null;

  @ApiProperty({
    example: OrderStatus.COMPLETE,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETE', 'CANCELED'],
  })
  status: OrderStatus;

  @ApiProperty()
  tableId: number;

  @ApiProperty({ example: '2025-06-16T08:59:04.292Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-16T15:30:41.448Z' })
  updatedAt: string;
}
