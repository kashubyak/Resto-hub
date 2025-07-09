import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterCompanyUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  avatarUrl: string;
}

export class RegisterCompanyResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty({ type: RegisterCompanyUserDto })
  user: RegisterCompanyUserDto;
}
