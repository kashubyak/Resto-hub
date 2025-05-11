import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateDishDto {
  @ApiPropertyOptional({
    description: 'The name of the dish',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'The description of the dish',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'The price of the dish' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({
    description: 'The URL of the dish image',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'The ID of the dish category',
  })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'The list of ingredients',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @ApiPropertyOptional({ description: 'The weight of the dish in grams' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  weightGr?: number;

  @ApiPropertyOptional({ description: 'The number of calories in the dish' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  calories?: number;

  @ApiPropertyOptional({
    description: 'Indicates if the dish is available for order',
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
