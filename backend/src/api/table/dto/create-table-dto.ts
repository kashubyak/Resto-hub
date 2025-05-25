import { IsInt, IsPositive } from 'class-validator';

export class CreateTableDto {
  @IsInt()
  @IsPositive()
  number: number;

  @IsInt()
  @IsPositive()
  seats: number;
}
