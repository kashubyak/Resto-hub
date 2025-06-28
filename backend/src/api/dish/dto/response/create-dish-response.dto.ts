import { ApiProperty } from '@nestjs/swagger';
import { CreateCategoryResponseDto } from 'src/api/category/dto/response/create-category-response.dto';

export class CreateDishResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  categoryId: number;

  @ApiProperty({ type: [String] })
  ingredients: string[];

  @ApiProperty()
  weight: number;

  @ApiProperty()
  calories: number;

  @ApiProperty()
  available: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CrateDishWithCategoryResponseDto extends CreateDishResponseDto {
  @ApiProperty()
  category: CreateCategoryResponseDto;
}
