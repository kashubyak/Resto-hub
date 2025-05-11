import { ApiProperty } from '@nestjs/swagger';

export class HttpErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Not Found' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}
