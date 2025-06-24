import { Role } from '.prisma/client/default';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FilterUserDto } from './dto/filter-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAllUsers(@Query() query: FilterUserDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }
}
