import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

export class CreatePostDto {
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(255)
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(255)
  description: string;
  status: number;
  thumbnail: any;
  user: User;
  @IsNotEmpty()
  category: Category;
}

export class QueryPostDto {
  @ApiProperty()
  page: number;
  @ApiProperty()
  perPage: number;
  @ApiProperty({ required: false })
  keyword: string;
  @ApiProperty({ required: false })
  sort?: string;

  category?: string;
}

export class UpdatePostDto {
  title: string;
  description: string;
  status: number;
  thumbnail: string;
  category: Category;
}
