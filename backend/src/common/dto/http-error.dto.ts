import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseDto {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;

  @ApiProperty({
    example: [
      'number must be a positive number',
      'seats must be an integer number',
    ],
  })
  message: string[] | string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class HttpErrorResponseDto {
  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;

  @ApiProperty({ example: 'Table not found' })
  message: string | string[];

  @ApiProperty({ example: 'Not Found' })
  error: string;
}

export class ConflictResponseDto {
  @ApiProperty({ example: HttpStatus.CONFLICT })
  statusCode: number;

  @ApiProperty({ example: 'Table number already exists' })
  message: string | string[];

  @ApiProperty({ example: 'Conflict' })
  error: string;
}
