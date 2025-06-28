import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class FilterDishDto {
  @ApiPropertyOptional({
    description: 'Search term to filter dishes by name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Minimum price to filter dishes',
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber({}, { message: 'minPrice must be a number' })
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price to filter dishes',
    example: 100,
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber({}, { message: 'maxPrice must be a number' })
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Filter dishes that are available',
    example: 'true',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  available?: boolean;

  @ApiPropertyOptional({
    description: 'Sort dishes by a specific field',
    example: 'name',
  })
  @IsOptional()
  @IsIn(['name', 'price', 'createdAt'])
  sortBy?: 'name' | 'price' | 'createdAt';

  @ApiPropertyOptional({
    description: 'Order of the sorting',
    example: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsPositive()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsPositive()
  limit?: number;
}
