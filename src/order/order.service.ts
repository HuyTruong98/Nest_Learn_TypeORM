import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateUUID } from 'helpers/config';
import * as moment from 'moment';
import { OrderProductService } from 'src/order-product/order-product.service';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { orderDto, orderUpdateDto } from './dto/order';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private orderProductService: OrderProductService, // @InjectRepository(OrderProduct) private orderProductRepository: Repository(OrderProduct),
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
      user: {
        id: user.id,
        name: user.firstName + user.lastName,
        email: user.email,
        avatar: user.avatar,
      },
      description: body.description,
    });
    await this.orderProductService.createProducts(order.id, orderProducts);
    return order;
  }

  async getOrderById(id: number): Promise<Order> {
    const orderById = await this.orderRepository.findOne({
      where: { id },
      relations: {
        user: true,
        orderProducts: { post: true },
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
    return orderById;
  }

  async updateOrderService(
    userId: number,
    orderId: number,
    body: orderUpdateDto,
  ): Promise<any> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const orderById = await this.getOrderById(orderId);
    if (!user) {
      throw new HttpException('User not exists !', HttpStatus.NOT_FOUND);
    }
    if (orderById.user.id !== user.id) {
      throw new HttpException(
        'You do not have permission to update this order.!',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.orderRepository.update(orderId, {
      modDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      description: body.description,
    });

    return await this.orderProductService.updateProducts(
      body.orderProducts,
      orderById.orderProducts.map((e) => ({
        postId: e.post.id,
        quantity: e.quantity,
      })),
    );
  }
}
