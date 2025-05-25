import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateTableDto {
  @ApiProperty({ example: 5, description: 'Unique number for the table' })
  @IsInt()
  @IsPositive()
  number: number;

  @ApiProperty({ example: 4, description: 'How many seats the table has' })
  @IsInt()
  @IsPositive()
  seats: number;
}
