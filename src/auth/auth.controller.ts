import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import {
  AuthDto,
  BodyLogin,
  LoginTokenDto,
  emailVerify,
  refresh_token,
} from './dto/auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @UsePipes(ValidationPipe)
  register(@Body() body: AuthDto): Promise<User> {
    return this.authService.signUpService(body);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Login successfully!' })
  @ApiResponse({ status: 401, description: 'Login fail!' })
  @UsePipes(ValidationPipe)
  login(@Body() body: BodyLogin): Promise<LoginTokenDto> {
    return this.authService.loginService(body);
  }

  @Post('refresh-token')
  refreshToken(@Body() body: refresh_token): Promise<LoginTokenDto> {
    return this.authService.refreshTokenService(body.refresh_token);
  }

  @Post('verify-email')
  sendEmailVerify(@Body() body: emailVerify): Promise<any> {
    return this.authService.sendEmailVerifyService(body.email);
  }
}
