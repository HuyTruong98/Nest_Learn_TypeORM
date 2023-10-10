import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/post/entities/post.entity';
import { OrderProduct } from './entities/order-product.entity';
import { OrderProductService } from './order-product.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProduct, Post]), ConfigModule],
  providers: [OrderProductService],
})
export class OrderProductModule {}
