import { IsEmail, IsEnum, IsString, MinLength } from '@nestjs/class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Password should be at least 6 characters long',
  })
  password: string;

  @IsEnum(Role)
  role: Role;
}
