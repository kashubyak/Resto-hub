import {
  IsEmail,
  IsEnum,
  IsString,
  IsUrl,
  MinLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ description: 'Full name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password with minimum 6 characters',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, {
    message: 'Password should be at least 6 characters long',
  })
  password: string;

  @ApiProperty({ enum: Role, description: 'Role of the user' })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    description: 'URL of the user avatar',
  })
  @IsUrl(undefined, { message: 'Avatar URL must be a valid URL' })
  avatarUrl: string;
}
