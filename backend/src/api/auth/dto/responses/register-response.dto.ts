import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

class UserResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ enum: Role, example: Role.WAITER })
  role: Role;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  avatarUrl: string;
}

export class RegisterResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ type: () => UserResponse })
  user: UserResponse;
}
