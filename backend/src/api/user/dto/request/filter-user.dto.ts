import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsPositive, IsString } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn([Role.COOK, Role.WAITER])
  role?: Role;

  @IsOptional()
  @IsIn(['name', 'email', 'createdAt', 'updatedAt'])
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  limit?: number;
}
