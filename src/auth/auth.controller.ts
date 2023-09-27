import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthDto, BodyLogin, LoginTokenDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @UsePipes(ValidationPipe)
  register(@Body() body: AuthDto): Promise<User> {
    return this.authService.signUpService(body);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() body: BodyLogin): Promise<LoginTokenDto> {
    return this.authService.loginService(body);
  }

  @Post('refresh-token')
  refreshToken(@Body() { refresh_token }): Promise<LoginTokenDto> {
    return this.authService.refreshTokenService(refresh_token);
  }
}
