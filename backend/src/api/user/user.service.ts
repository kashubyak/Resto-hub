import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
}
