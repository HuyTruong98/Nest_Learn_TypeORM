import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { OrderProduct } from 'src/order/entities/order-product.entity';
import { User } from 'src/user/entities/user.entity';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Category, OrderProduct]),
    ConfigModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
