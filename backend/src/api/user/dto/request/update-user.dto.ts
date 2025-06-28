import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  oldPassword?: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsIn([Role.COOK, Role.WAITER])
  role?: Role;

  @ApiProperty({
    description: 'URL of the user avatar',
  })
  @IsOptional()
  @IsUrl(undefined, { message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;
}
