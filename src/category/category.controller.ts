import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CategoryService } from './category.service';
import { bodyCategoryDto } from './dto/category.dto';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/list')
  findAll(): Promise<Category[]> {
    return this.categoryService.findAllService();
  }

  @Post('/info')
  create(@Body() body: bodyCategoryDto): Promise<Category> {
    return this.categoryService.createService(body);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categoryService.findOneService(Number(id));
  }

  @Put(':id')
  updateById(@Param('id') id: number, @Body() body: bodyCategoryDto) {
    return this.categoryService.updateByIdService(Number(id), body);
  }

  @Delete('id')
  deleteById(@Param('id') id: number) {
    return this.categoryService.deleteByIdService(id);
  }
}
