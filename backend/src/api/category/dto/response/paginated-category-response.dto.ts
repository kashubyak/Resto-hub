import { ApiProperty } from '@nestjs/swagger';
import { CategorySummaryDto } from './category-summary.dto';

export class PaginatedCategoryResponseDto {
  @ApiProperty({ type: [CategorySummaryDto] })
  items: CategorySummaryDto[];

  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}
