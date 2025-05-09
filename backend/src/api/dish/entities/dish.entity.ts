import { ApiProperty } from '@nestjs/swagger';

export class Dish {
  @ApiProperty({ description: 'The unique identifier of the dish' })
  id: number;

  @ApiProperty({ description: 'The name of the dish' })
  name: string;

  @ApiProperty({ description: 'The description of the dish', nullable: true })
  description: string;

  @ApiProperty({ description: 'The price of the dish' })
  price: number;

  @ApiProperty({ description: 'The URL of the dish image' })
  imageUrl: string;

  @ApiProperty({ description: 'The ID of the dish category (UUID)' })
  categoryId: string;

  @ApiProperty({ description: 'The creation timestamp of the record' })
  createdAt: Date;

  @ApiProperty({ description: 'The last update timestamp of the record' })
  updatedAt: Date;
}
