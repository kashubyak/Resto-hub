import { ApiProperty } from '@nestjs/swagger';
import { CreateDishResponseDto } from 'src/api/dish/dto/response/create-dish-response.dto';

export class BaseCategoryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CategorySummaryDto extends BaseCategoryDto {
  @ApiProperty({ type: [CreateDishResponseDto] })
  dishes: CreateDishResponseDto[];
}
