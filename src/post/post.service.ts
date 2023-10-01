import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseSortParam } from 'helpers/config';
import * as moment from 'moment';
import { User } from 'src/user/entities/user.entity';
import { Like, Repository, UpdateResult } from 'typeorm';
import { PostDto, QueryPostDto, UpdatePostDto } from './dto/post.dto';
import { Post } from './entities/post.entity';
import { listDto } from 'src/user/dto/user.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async createPostService(userId: number, body: PostDto): Promise<Post> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not exists !', HttpStatus.NOT_FOUND);
    }
    try {
      const res = await this.postRepository.save({
        ...body,
        regDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        user,
      });

      return await this.postRepository.findOneBy({ id: res.id });
    } catch (error) {
      console.error(error);
      throw new HttpException('Can not create post', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllPostService(query: QueryPostDto): Promise<listDto> {
    const { page, perPage, keyword, sort } = query;

    const options: QueryPostDto = {
      page: Number(page) || 1,
      perPage: Number(perPage) || 10,
      keyword: keyword || '',
      sort: sort || 'DESC',
    };

    const skip = (options.page - 1) * options.perPage;

    let whereClause;
    if (options.keyword) {
      whereClause = [
        { title: Like(`%${options.keyword}%`) },
        { description: Like(`%${options.keyword}%`) },
      ];
    }
    const order = parseSortParam(options.sort);

    const [res, total] = await this.postRepository.findAndCount({
      where: whereClause,
      order,
      take: options.perPage,
      skip,
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      },
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

  async findByIdService(id: number): Promise<Post> {
    const current_post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      },
    });

    if (!current_post) {
      throw new HttpException('Post not exists !', HttpStatus.NOT_FOUND);
    }

    return current_post;
  }

  async updateByIdService(
    id: number,
    body: UpdatePostDto,
  ): Promise<UpdateResult> {
    const current_post = await this.postRepository.findOneBy({ id });
    if (!current_post) {
      throw new HttpException('Post not exists !', HttpStatus.NOT_FOUND);
    }
    try {
      return await this.postRepository.update(id, body);
    } catch (error) {
      console.error(error);
      throw new HttpException('Can not update post', HttpStatus.BAD_REQUEST);
    }
  }
}
