import { Controller, Get } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/list')
  findAll(): Promise<Category[]> {
    return this.categoryService.findAllService();
  }
}
