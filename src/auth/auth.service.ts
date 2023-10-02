import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthDto, BodyLogin, LoginTokenDto } from './dto/auth.dto';
import { MailerService } from '@nest-modules/mailer';

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

  async sendEmailVerifyService(email: string): Promise<any> {
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

    return await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to my website',
      template: './welcome',
      context: {
        name: email,
      },
    });
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
}
