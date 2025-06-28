import { ApiProperty } from '@nestjs/swagger';
import { UserItemDto } from './user-item.dto';

export class PaginatedUserResponseDto {
  @ApiProperty({ type: [UserItemDto] })
  data: UserItemDto[];

  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}
