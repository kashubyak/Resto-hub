import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDishDto {
  @ApiProperty({ description: 'The name of the dish' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the dish',
    required: false,
    nullable: true,
  })
  @IsString()
  description: string;

  @ApiProperty({ description: 'The price of the dish' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'The URL of the dish image' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'The ID of the dish category (UUID)' })
  @IsNumber()
  categoryId?: number;
}
