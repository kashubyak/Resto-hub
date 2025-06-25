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
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RegisterDto } from '../auth/dto/requests/register.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Roles(Role.ADMIN)
  registerUser(@Body() dto: RegisterDto) {
    return this.userService.registerUser(dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAllUsers(@Query() query: FilterUserDto) {
    return this.userService.findAll(query);
  }

  @Get('me')
  @Roles(Role.ADMIN)
  findCurrentUser(@CurrentUser() user: User) {
    return this.userService.findById(user.id);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Patch('me')
  @Roles(Role.ADMIN)
  updateCurrentUser(@CurrentUser() user: User, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(user.id, dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
