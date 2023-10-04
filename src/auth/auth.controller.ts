import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Render,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import {
  AuthDto,
  BodyLogin,
  LoginTokenDto,
  emailVerify,
  refresh_token,
} from './dto/auth.dto';

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

  @Post('send-verify-email')
  sendEmailVerify(@Body() body: emailVerify): Promise<string> {
    return this.authService.sendEmailVerifyService(body.email);
  }

  @Get('verify-email/:token')
  @Render('verify-email')
  async verifyEmail(
    @Res() res: Response,
    @Param('token') token: string,
  ): Promise<{ email: string }> {
    const email = await this.authService.verifyEmailService(token, res);
    return { email };
  }

  @Post('send-email-reset-password')
  sendEmailResetPwd(@Body() body: emailVerify): Promise<string> {
    return this.authService.sendEmailResetPwdService(body.email);
  }

  @Get('reset-password/:token')
  resetPassword(
    @Res() res: Response,
    @Param('token') token: string,
  ): Promise<any> {
    return this.authService.verifyTokenToChangePassword(token, res);
  }
}
