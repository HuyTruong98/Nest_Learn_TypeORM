import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private config: ConfigService,
  ) {}

  async findAllService(): Promise<User[]> {
    return await this.userRepository.find({
      select: [
        'id',
        'firstName',
        'lastName',
        'status',
        'email',
        'regDt',
        'modDt',
      ],
    });
  }

  async findOneService(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async createService(body: AuthDto): Promise<User> {
    const checkEmail = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (checkEmail) {
      throw new HttpException('Email already exists!', HttpStatus.CONFLICT);
    }
    const hashPwd = await bcrypt.hash(body.password, 10);
    const newBody = {
      ...body,
      password: hashPwd,
    };
    return await this.userRepository.save(newBody);
  }
}
