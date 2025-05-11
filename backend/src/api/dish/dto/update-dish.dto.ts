import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDishDto {
  @ApiPropertyOptional({
    description: 'The name of the dish',
    example: 'New Pizza Name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'The description of the dish',
    example: 'Updated description.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'The price of the dish', example: 15.5 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'The URL of the dish image',
    example: 'https://example.com/new-image.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'The ID of the dish category',
    example: 4,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
