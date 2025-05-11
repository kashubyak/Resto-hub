import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDishDto {
  @ApiProperty({
    description: 'The name of the dish',
    example: 'Pizza Margherita',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the dish',
    example: 'Classic Italian pizza with tomato and mozzarella.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The price of the dish', example: 13.99 })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The URL of the dish image',
    example: 'https://example.com/pizza.jpg',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiPropertyOptional({
    description: 'The ID of the dish category',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  weightGr?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  calories?: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
