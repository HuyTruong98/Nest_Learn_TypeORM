import { MailerService } from '@nest-modules/mailer';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthDto, BodyLogin, LoginTokenDto } from './dto/auth.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private config: ConfigService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signUpService(body: AuthDto): Promise<User> {
    const checkEmail = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (checkEmail) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const hasPwd = await this.hasPassword(body.password);
    const newBody = {
      ...body,
      refresh_token: 'refresh_token_string',
      password: hasPwd,
      regDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };
    return await this.userRepository.save(newBody);
  }

  async loginService(body: BodyLogin): Promise<LoginTokenDto> {
    const checkUser = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (!checkUser) {
      throw new HttpException('Email is not exists', HttpStatus.NOT_FOUND);
    }
    if (checkUser.status === 1) {
      throw new HttpException(
        'Email has not been verified !',
        HttpStatus.FORBIDDEN,
      );
    }
    const checkPwd = bcrypt.compareSync(body.password, checkUser.password);
    if (!checkPwd) {
      throw new HttpException(
        'Password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = {
      id: checkUser.id,
      email: checkUser.email,
    };

    return this.generateToken(
      payload,
      this.config.get<string>('EXP_IN_REFRESH_TOKEN'),
    );
  }

  async refreshTokenService(refresh_token: string): Promise<LoginTokenDto> {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.config.get<string>('SECRET_KEY'),
      });

      const checkExistToken = await this.userRepository.findOneBy({
        email: verify.email,
        refresh_token,
      });
      if (checkExistToken) {
        return this.generateToken(
          { id: verify.id, email: verify.email },
          this.config.get<string>('EXP_IN_REFRESH_TOKEN'),
        );
      } else {
        throw new HttpException(
          'Refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendEmailVerifyService(email: string): Promise<string> {
    const checkUser = await this.userRepository.findOne({
      where: { email },
    });

    if (!checkUser) {
      throw new HttpException('Email is not exists', HttpStatus.NOT_FOUND);
    }

    if (checkUser.status === 2) {
      throw new HttpException(
        'Email has been verified',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokenVerifyEmail = await this.generateTokenVerify(
      {
        id: checkUser.id,
        email: checkUser.email,
      },
      this.config.get<string>('JWT_VERIFY_EXPIRATION_MINUTES'),
    );

    const verifyUrl = `http://localhost:${this.config.get(
      'PORT',
    )}/api/auth/verify-email/${tokenVerifyEmail}`;

    await this.mailerService.sendMail({
      to: checkUser.email,
      subject: 'Welcome to my website',
      template: 'send-email-verify',
      context: {
        linkToVerify: verifyUrl,
      },
    });
    return 'Email verification sent successfully';
  }

  async verifyEmailService(token: string, res: Response): Promise<string> {
    try {
      const secret = this.config.get<string>('SECRET_KEY');
      const decodedToken = await this.jwtService.verify(token, { secret });

      if (decodedToken) {
        this.userRepository.update(decodedToken.id, {
          status: 2,
          modDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        });
        return decodedToken.email;
      } else {
        throw new HttpException('Verify failed', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.render('expired');
      } else {
        res.render('expired', {
          errorMessage:
            'Your verification email has expired, please create a new request',
        });
      }
    }
  }

  async sendEmailResetPwdService(email: string): Promise<string> {
    const checkUser = await this.userRepository.findOne({
      where: { email },
    });

    if (!checkUser) {
      throw new HttpException('Email is not exists', HttpStatus.NOT_FOUND);
    }

    if (checkUser.status === 1) {
      throw new HttpException(
        'Email must be authenticated before password reset',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokenResetEmail = await this.generateTokenVerify(
      {
        id: checkUser.id,
        email: checkUser.email,
      },
      this.config.get<string>('JWT_VERIFY_EXPIRATION_MINUTES'),
    );

    const verifyUrl = `http://localhost:${this.config.get(
      'PORT',
    )}/api/auth/reset-password/${tokenResetEmail}`;

    await this.mailerService.sendMail({
      to: checkUser.email,
      subject: 'Welcome to my website',
      template: 'send-email-reset-password',
      context: {
        linkToVerify: verifyUrl,
      },
    });

    return 'Email reset password sent successfully';
  }

  async verifyTokenToChangePassword(
    token: string,
    res: Response,
  ): Promise<string> {
    try {
      const secret = this.config.get<string>('SECRET_KEY');
      const decodedToken = await this.jwtService.verify(token, { secret });

      if (decodedToken) {
        return decodedToken.email;
      } else {
        throw new HttpException(
          'Reset password failed',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.render('expired');
      } else {
        res.render('expired', {
          errorMessage:
            'Your verification email has expired, please create a new request',
        });
      }
    }
  }

  private async generateToken(
    payload: { id: number; email: string },
    expiresIn: string,
  ) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('SECRET_KEY'),
      expiresIn,
    });

    await this.userRepository.update(
      {
        email: payload.email,
      },
      {
        refresh_token: refresh_token,
      },
    );

    return { access_token, refresh_token };
  }

  private async hasPassword(pwd: string): Promise<string> {
    const salt = await bcrypt.genSalt(Number(this.config.get('SALT_ROUND')));
    const hash = await bcrypt.hash(pwd, salt);

    return hash;
  }

  private async generateTokenVerify(
    payload: {
      id: number;
      email: string;
    },
    expiresIn: string,
  ) {
    const verify_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('SECRET_KEY'),
      expiresIn,
    });

    return verify_token;
  }
}
