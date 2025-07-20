import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { folder_avatar } from 'src/common/constants';
import { S3Service } from 'src/common/s3/s3.service';
import { RegisterDto } from '../auth/dto/request/register.dto';
import { FilterUserDto } from './dto/request/filter-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) {}

  async registerUser(
    dto: RegisterDto,
    file: Express.Multer.File,
    companyId: number,
  ) {
    if (!file) throw new BadRequestException('Avatar image is required');
    const existingUser = await this.userRepository.findByEmail(
      dto.email,
      companyId,
    );
    if (existingUser) throw new BadRequestException('Email already exists');
    if (dto.role === Role.ADMIN)
      throw new BadRequestException('Cannot assign ADMIN role');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const avatarUrl = await this.s3Service.uploadFile(file, folder_avatar);
    const user = await this.userRepository.createUser(
      {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        avatarUrl,
        companyId,
      },
      companyId,
    );

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

  async findAll(query: FilterUserDto, companyId: number) {
    const {
      search,
      role,
      sortBy = 'createdAt',
      order = 'desc',
      page: rawPage,
      limit: rawLimit,
    } = query;

    const page = rawPage || 1;
    const limit = rawLimit || 10;
    const skip = (page - 1) * limit;

    const allowedRoles: Role[] = ['COOK', 'WAITER'];
    const where: Prisma.UserWhereInput = {
      companyId,
      role: role ? role : { in: allowedRoles },
      OR: search
        ? [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ]
        : undefined,
    };
    const { data, total } = await this.userRepository.findManyWithCount({
      where,
      orderBy: { [sortBy]: order },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number, companyId: number) {
    const user = await this.userRepository.findUser(id, companyId);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async updateUser(
    id: number,
    dto: UpdateUserDto,
    file: Express.Multer.File,
    companyId: number,
  ) {
    const user = await this.userRepository.findUserWithPassword(id, companyId);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    if (dto.role === Role.ADMIN)
      throw new BadRequestException('Cannot assign ADMIN role');

    if (dto.email && dto.email !== user.email) {
      const existingEmail = await this.userRepository.findByEmail(
        dto.email,
        companyId,
      );
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

    let avatarUrl = user.avatarUrl;
    if (file) {
      if (avatarUrl) await this.s3Service.deleteFile(avatarUrl);
      avatarUrl = await this.s3Service.uploadFile(file, folder_avatar);
    }

    const { oldPassword, ...safeData } = dto;
    return this.userRepository.updateUser(
      id,
      {
        ...safeData,
        avatarUrl,
      },
      companyId,
    );
  }

  async deleteUser(id: number, companyId: number) {
    const user = await this.userRepository.findUser(id, companyId);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    if (user.avatarUrl) {
      try {
        await this.s3Service.deleteFile(user.avatarUrl);
      } catch (error) {
        throw new BadRequestException('Failed to delete avatar image');
      }
    }
    return this.userRepository.deleteUser(id, companyId);
  }
}
