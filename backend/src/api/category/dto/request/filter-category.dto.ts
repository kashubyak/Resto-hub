import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class FilterCategoryDto {
  @ApiPropertyOptional({
    description: 'Search term to filter categories by name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter categories that have dishes',
    example: 'true',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasDishes?: boolean;

  @ApiPropertyOptional({
    description: 'Sort categories by a specific field',
    example: 'name',
  })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'createdAt', 'updatedAt'])
  sortBy?: 'name' | 'createdAt' | 'updatedAt';

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
  @Transform(({ value }) => Number(value))
  @IsPositive()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsPositive()
  limit?: number;
}
