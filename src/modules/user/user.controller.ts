import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Req() req, @Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, req.user?.userId, req.user?.tenantId);
  }

  @Get()
  findAll(@Req() req) {
    return this.userService.findAll(req.user?.tenantId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.userService.findOne(+id, req.user?.tenantId);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto, req.user?.userId, req.user?.tenantId);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.userService.remove(+id, req.user?.userId, req.user?.tenantId);
  }
}
