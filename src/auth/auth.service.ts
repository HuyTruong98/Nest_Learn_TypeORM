import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private config: ConfigService,
  ) {}

  async signUpService(body: SignUpDto): Promise<User> {
    const hasPwd = await this.hasPassword(body.password);
    const newBody = {
      ...body,
      refresh_token: 'refresh_token_string',
      password: hasPwd,
    };
    return await this.userRepository.save(newBody);
  }

  private async hasPassword(pwd: string): Promise<string> {
    const salt = await bcrypt.genSalt(Number(this.config.get('SALTROUND')));
    const hash = await bcrypt.hash(pwd, salt);

    return hash;
  }
}
