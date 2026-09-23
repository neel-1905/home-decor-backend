import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RequirePermissions, ResponseMessage } from '@/common/decorators';
import { UserQueryDto } from './dto/user-query.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @RequirePermissions('user:read')
  @ResponseMessage('Users retrieved successfully')
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get('me')
  @ResponseMessage('User retrieved successfully')
  getMe(@Session() session: UserSession) {
    return this.usersService.findById(session.user.id);
  }

  @Patch('me')
  @ResponseMessage('Profile updated successfully')
  updateMe(@Session() session: UserSession, @Body() data: UpdateUserDto) {
    return this.usersService.update(session.user.id, data);
  }

  @Get(':id')
  @RequirePermissions('user:read')
  @ResponseMessage('User retrieved successfully')
  getById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @RequirePermissions('user:update')
  @ResponseMessage('User updated successfully')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('user:delete')
  @ResponseMessage('User deleted successfully')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
