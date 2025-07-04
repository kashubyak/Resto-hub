import { Role, User } from '.prisma/client/default';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { multerOptions } from 'src/common/s3/file-upload.util';
import { MulterErrorInterceptor } from 'src/common/s3/multer-error.interceptor';
import { RegisterDto } from '../auth/dto/request/register.dto';
import { RegisterResponseDto } from '../auth/dto/response/register-response.dto';
import { FilterUserDto } from './dto/request/filter-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { PaginatedUserResponseDto } from './dto/response/paginated-user-response.dto';
import { UserItemDto } from './dto/response/user-item.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    MulterErrorInterceptor,
    FileInterceptor('avatarUrl', multerOptions),
  )
  @ApiOperation({ description: 'Create a new user (ADMIN only)' })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: RegisterResponseDto,
  })
  registerUser(
    @Body() dto: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.registerUser(dto, file);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ description: 'Search and view users (ADMIN only)' })
  @ApiOkResponse({
    description: 'List of users with pagination',
    type: PaginatedUserResponseDto,
  })
  findAllUsers(@Query() query: FilterUserDto) {
    return this.userService.findAll(query);
  }

  @Get('me')
  @Roles(Role.ADMIN)
  @ApiOperation({ description: 'Find current user (ADMIN only)' })
  @ApiOkResponse({
    description: 'Current user found successfully',
    type: UserItemDto,
  })
  findCurrentUser(@CurrentUser() user: User) {
    return this.userService.findById(user.id);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ description: 'Find user by ID (ADMIN only)' })
  @ApiOkResponse({
    description: 'User found successfully',
    type: UserItemDto,
  })
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Patch('me')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    MulterErrorInterceptor,
    FileInterceptor('avatarUrl', multerOptions),
  )
  @ApiOperation({ description: 'Update current user (ADMIN only)' })
  @ApiOkResponse({
    description: 'Current user updated successfully',
    type: UserItemDto,
  })
  updateCurrentUser(
    @CurrentUser() user: User,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateUser(user.id, dto, file);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseInterceptors(
    MulterErrorInterceptor,
    FileInterceptor('avatarUrl', multerOptions),
  )
  @ApiOperation({ description: 'Update user by ID (ADMIN only)' })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserItemDto,
  })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateUser(id, dto, file);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ description: 'Delete user by ID (ADMIN only)' })
  @ApiOkResponse({
    description: 'User deleted successfully',
    type: UserItemDto,
  })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
