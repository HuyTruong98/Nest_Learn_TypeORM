import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { filterQueryDto, listUserDto, updateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('list')
  findAll(@Query() query: filterQueryDto): Promise<listUserDto> {
    return this.userService.findAllService(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOneService(Number(id));
  }

  @Post('info')
  createUser(@Body() body: AuthDto): Promise<User> {
    return this.userService.createService(body);
  }

  @Put(':id/update')
  updateById(@Param('id') id: number, @Body() body: updateUserDto) {
    return this.userService.updateByIdService(Number(id), body);
  }

  @Delete(':id/')
  deleteById(@Param('id') id: number) {
    return this.userService.deleteByIdService(Number(id));
  }
}
