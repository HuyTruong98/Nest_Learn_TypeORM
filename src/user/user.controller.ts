import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('list')
  findAll(): Promise<User[]> {
    return this.userService.findAllService();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOneService(Number(id));
  }

  @Post('info')
  createUser(@Body() body: AuthDto): Promise<User> {
    return this.userService.createService(body);
  }
}
