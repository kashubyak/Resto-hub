import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class AssignOrderResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  waiterId: number;

  @ApiProperty({ example: 1 })
  cookId: number;

  @ApiProperty({
    example: 'IN_PROGRESS',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETE'],
  })
  status: OrderStatus;

  @ApiProperty({ example: 1 })
  tableId: number;

  @ApiProperty({ example: '2025-06-16T08:59:04.292Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-16T13:44:13.152Z' })
  updatedAt: string;
}

export class CancelOrderResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  waiterId: number;

  @ApiProperty({ example: null, nullable: true })
  cookId: number | null;

  @ApiProperty({
    example: 'CANCELED',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETE', 'CANCELED'],
  })
  status: OrderStatus;

  @ApiProperty({ example: 1 })
  tableId: number;

  @ApiProperty({ example: '2025-06-16T08:32:24.116Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-16T15:28:35.005Z' })
  updatedAt: string;
}

export class UpdateOrderStatusResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  waiterId: number;

  @ApiProperty({ example: 1, nullable: true })
  cookId: number | null;

  @ApiProperty({
    example: 'COMPLETE',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETE', 'CANCELED'],
  })
  status: OrderStatus;

  @ApiProperty({ example: 1 })
  tableId: number;

  @ApiProperty({ example: '2025-06-16T08:59:04.292Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-16T15:30:41.448Z' })
  updatedAt: string;
}
