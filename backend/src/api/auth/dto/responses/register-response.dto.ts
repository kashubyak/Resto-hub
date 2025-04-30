import { User } from '@prisma/client';

export class RegisterResponseDto {
  access_token: string;
  refresh_token: string;
  user: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}
