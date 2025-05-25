import { ApiProperty } from '@nestjs/swagger';

export class TableEntity {
  @ApiProperty({ example: 1, description: 'Unique identifier for the table' })
  id: number;

  @ApiProperty({ example: 5, description: 'Table number' })
  number: number;

  @ApiProperty({ example: 4, description: 'Number of seats at the table' })
  seats: number;

  @ApiProperty({ example: true, description: 'Is the table active?' })
  active: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  updatedAt: Date;
}
