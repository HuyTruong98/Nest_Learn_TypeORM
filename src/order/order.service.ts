import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createOrderService(userId: number, body: any): Promise<any> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not exists !', HttpStatus.NOT_FOUND);
    }
    const createdOrder = await this.orderRepository.create({
      ...body,
      user,
      regDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    });
    return await this.orderRepository.save(createdOrder);
  }
}
