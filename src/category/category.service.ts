import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { bodyCategoryDto } from './dto/category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAllService(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async createService(body: bodyCategoryDto): Promise<Category> {
    const checkName = await this.categoryRepository.findOne({
      where: { name: body.name },
    });
    if (checkName) {
      throw new HttpException('Category already exists!', HttpStatus.CONFLICT);
    }
    const newBody = {
      ...body,
      status: 1,
      regDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };
    return await this.categoryRepository.save(newBody);
  }

  async findOneService(id: number): Promise<Category> {
    const checkCategory = await this.findUserById(id);

    return checkCategory;
  }

  async updateByIdService(
    id: number,
    body: bodyCategoryDto,
  ): Promise<UpdateResult> {
    await this.findUserById(id);
    const newBody = {
      ...body,
      modDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };
    return await this.categoryRepository.update(id, newBody);
  }

  async deleteByIdService(id: number): Promise<DeleteResult> {
    await this.findUserById(id);

    return await this.categoryRepository.delete(id);
  }

  private async findUserById(id: number) {
    const checkCategory = await this.categoryRepository.findOneBy({ id });
    if (!checkCategory) {
      throw new HttpException('Category not exists !', HttpStatus.NOT_FOUND);
    }

    return checkCategory;
  }
}
