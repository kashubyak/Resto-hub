import { ApiProperty } from '@nestjs/swagger';
import { CrateDishWithCategoryResponseDto } from './create-dish-response.dto';

export class PaginatedDishesWithCategoryResponseDto {
  @ApiProperty({ type: [CrateDishWithCategoryResponseDto] })
  data: CrateDishWithCategoryResponseDto[];

  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}
