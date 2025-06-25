import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../auth/dto/requests/register.dto';
import { FilterUserDto } from './dto/request/filter-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(dto: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) throw new BadRequestException('Email already exists');
    if (dto.role === Role.ADMIN)
      throw new BadRequestException('Cannot assign ADMIN role');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.createUser({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      avatarUrl: dto.avatarUrl,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findAll(query: FilterUserDto) {
    const {
      search,
      role,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const allowedRoles: Role[] = ['COOK', 'WAITER'];
    const where: Prisma.UserWhereInput = {
      role: role ? role : { in: allowedRoles },
      OR: search
        ? [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ]
        : undefined,
    };
    const skip = (page - 1) * limit;
    const { items, total } = await this.userRepository.findManyWithCount({
      where,
      orderBy: { [sortBy]: order },
      skip,
      take: limit,
    });
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number) {
    const user = await this.userRepository.findUser(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }
  async updateUser(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findUserWithPassword(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (dto.role === Role.ADMIN)
      throw new BadRequestException('Cannot assign ADMIN role');

    if (dto.email && dto.email !== user.email) {
      const existingEmail = await this.userRepository.findByEmail(dto.email);
      if (existingEmail) throw new BadRequestException('Email already exists');
    }

    if (dto.password) {
      if (!dto.oldPassword)
        throw new BadRequestException(
          'Old password is required to set new password',
        );
      if (dto.oldPassword && !dto.password)
        throw new BadRequestException('New password is required');

      const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
      if (!isMatch) throw new BadRequestException('Old password is incorrect');
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    const { oldPassword, ...safeData } = dto;
    return await this.userRepository.updateUser(id, safeData);
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findUser(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return await this.userRepository.deleteUser(id);
  }

  async getCurrentUser(id: number) {
    const user = await this.userRepository.findUser(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }
}
