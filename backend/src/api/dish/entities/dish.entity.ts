import { ApiProperty } from '@nestjs/swagger';
import { CreateCategoryEntity } from 'src/api/category/entities/category.entity';

export class DishEntity {
  @ApiProperty({ description: 'The unique identifier of the dish', example: 1 })
  id: number;

  @ApiProperty({
    description: 'The name of the dish',
    example: 'Pizza Margherita',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the dish',
    example: 'Tomato, mozzarella, and basil.',
  })
  description: string;

  @ApiProperty({ description: 'The price of the dish', example: 13.99 })
  price: number;

  @ApiProperty({
    description: 'The URL of the dish image',
    example: 'https://example.com/pizza.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'The ID of the dish category (nullable if unassigned)',
    nullable: true,
    example: 3,
  })
  categoryId: number | null;

  @ApiProperty({
    description: 'The list of ingredients for the dish',
    example: ['Tomato', 'Mozzarella', 'Basil'],
  })
  ingredients: string[];

  @ApiProperty({
    description: 'The weight of the dish in grams',
    example: 300,
  })
  weightGr: number;

  @ApiProperty({
    description: 'The number of calories in the dish',
    example: 800,
  })
  calories: number;

  @ApiProperty({
    description: 'Indicates if the dish is available for order',
    example: true,
  })
  available: boolean;

  @ApiProperty({
    description: 'The creation timestamp of the record',
    example: '2024-05-05T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update timestamp of the record',
    example: '2024-05-06T12:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    type: () => [CreateCategoryEntity],
    required: false,
  })
  category: CreateCategoryEntity[];
}
