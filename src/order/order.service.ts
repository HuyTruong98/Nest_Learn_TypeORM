import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateUUID } from 'helpers/config';
import * as moment from 'moment';
import { OrderProductService } from 'src/order-product/order-product.service';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { orderDto } from './dto/order';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private orderProductService: OrderProductService,
  ) {}

  async createOrderService(userId: number, body: orderDto): Promise<Order> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not exists !', HttpStatus.NOT_FOUND);
    }
    const orderProducts = await Promise.all(
      body.orderProducts.map(async (e) => {
        const post = await this.postRepository.findOneBy({ id: e.postId });
        if (!post) {
          throw new HttpException(
            `Post with ID ${e.postId} not found.`,
            HttpStatus.NOT_FOUND,
          );
        }
        return e;
      }),
    );
    const order = await this.orderRepository.save({
      regDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      orderNo: generateUUID(),
      user,
      description: body.description,
    });
    await this.orderProductService.createProducts(order.id, orderProducts);
    return order;
  }

  async getAllOrderService(): Promise<any> {
    // const [res,data]
  }
}
