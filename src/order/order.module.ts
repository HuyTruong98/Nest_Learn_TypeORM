import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProductService } from 'src/order-product/order-product.service';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { OrderProduct } from '../order-product/entities/order-product.entity';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, OrderProduct, Post]),
    ConfigModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderProductService],
})
export class OrderModule {}
