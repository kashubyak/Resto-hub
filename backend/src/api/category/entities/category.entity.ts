import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Category } from '@prisma/client';
import { DishEntity } from 'src/api/dish/entities/dish.entity';

export class CategoryEntity implements Category {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Salads' })
  name: string;

  @ApiProperty({ example: '2024-05-05T10:10:10.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-05-05T10:15:00.000Z' })
  updatedAt: Date;

  @ApiProperty({
    type: () => [DishEntity],
    required: false,
  })
  dishes?: DishEntity[];
}

export class CreateCategoryEntity extends OmitType(CategoryEntity, [
  'dishes',
]) {}
