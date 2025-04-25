export class RegisterResponseDto {
  access_token: string;

  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}
