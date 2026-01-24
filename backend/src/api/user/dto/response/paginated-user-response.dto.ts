import { ApiProperty } from '@nestjs/swagger'
import { BasePaginationDto } from 'src/common/dto/pagination-response.dto'
import { UserItemDto } from './user-item.dto'

export class PaginatedUserResponseDto extends BasePaginationDto {
	@ApiProperty({ type: [UserItemDto] })
	data: UserItemDto[]
}
