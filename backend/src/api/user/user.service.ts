import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { FilterUserDto } from './dto/filter-user.dto';
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
}
