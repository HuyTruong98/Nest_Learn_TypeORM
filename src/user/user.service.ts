import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { filterQueryDto, listUserDto, updateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private config: ConfigService,
  ) {}

  async findAllService(query: filterQueryDto): Promise<listUserDto> {
    const { page, perPage, keyword, status, sort } = query;

    const options: filterQueryDto = {
      page: Number(page) || 1,
      perPage: Number(perPage) || 10,
      keyword: keyword || undefined,
      status: status || undefined,
      sort: sort || 'DESC',
    };

    const skip = (options.page - 1) * options.perPage;

    let whereClause;
    if (options.keyword) {
      whereClause = [
        { email: Like(`%${options.keyword}%`) },
        { firstName: Like(`%${options.keyword}%`) },
        { lastName: Like(`%${options.keyword}%`) },
      ];
    }

    const order = this.parseSortParam(options.sort);

    const [res, total] = await this.userRepository.findAndCount({
      where: whereClause,
      order,
      take: options.perPage,
      skip,
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
    const lastPage = Math.ceil(total / options.perPage);
    const nextPage = options.page + 1 > lastPage ? null : options.page + 1;
    const prevPage = options.page - 1 < 1 ? null : options.page - 1;

    return {
      data: res,
      total,
      currentPage: options.page,
      nextPage,
      lastPage,
      prevPage,
    };
  }

  async findOneService(id: number): Promise<User> {
    return await this.findUserById(id);
  }

  async createService(body: AuthDto): Promise<User> {
    const checkEmail = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (checkEmail) {
      throw new HttpException('Email already exists!', HttpStatus.CONFLICT);
    }
    const hashPwd = await bcrypt.hash(
      body.password,
      Number(this.config.get('SALT_ROUND')),
    );
    const newBody = {
      ...body,
      password: hashPwd,
      regDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };
    return await this.userRepository.save(newBody);
  }

  async updateByIdService(
    id: number,
    body: updateUserDto,
  ): Promise<UpdateResult> {
    const checkUser = await this.findUserById(id);
    if (!checkUser) {
      throw new HttpException('User not exists !', HttpStatus.NOT_FOUND);
    }
    if (body.password) {
      const hashPwd = await bcrypt.hash(
        body.password,
        Number(this.config.get('SALT_ROUND')),
      );

      return await this.userRepository.update(id, {
        ...body,
        password: hashPwd,
        modDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    return await this.userRepository.update(id, {
      ...body,
      modDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  async deleteByIdService(id: number): Promise<DeleteResult> {
    const checkUser = await this.findUserById(id);
    if (!checkUser) {
      throw new HttpException('User not exists !', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.delete(id);
  }

  async updateAvatarService(id: number, avatar: string): Promise<UpdateResult> {
    const checkUser = await this.findUserById(id);
    if (!checkUser) {
      throw new HttpException('User not exists !', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.update(id, { avatar });
  }

  private async findUserById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  private parseSortParam(sortParam: string): Record<string, 'ASC' | 'DESC'> {
    if (!sortParam) {
      return {};
    }

    const sortSegments = sortParam.split(',').map((item) => item.trim());

    const order: Record<string, 'ASC' | 'DESC'> = {};

    sortSegments.forEach((segment) => {
      const [fieldName, orderDirection] = segment.split(' ');
      if (fieldName && orderDirection) {
        order[fieldName] =
          orderDirection.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
      }
    });

    return order;
  }
}
