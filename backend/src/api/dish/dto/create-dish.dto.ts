import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
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
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'The URL of the dish image',
    example: 'https://example.com/pizza.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @ApiPropertyOptional({
    description: 'The ID of the dish category',
    example: 3,
  })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty({
    description: 'The list of ingredients',
    example: ['Tomato', 'Mozzarella', 'Basil'],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  ingredients?: string[];

  @ApiPropertyOptional({
    description: 'The weight of the dish in grams',
    example: 300,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  weightGr?: number;

  @ApiPropertyOptional({
    description: 'The number of calories in the dish',
    example: 800,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  calories?: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
