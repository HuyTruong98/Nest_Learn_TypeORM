import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async createOrderService(userId: number, body: any): Promise<any> {
    console.log('🚀  userId:', userId);
    console.log('🚀  body:', body);
  }
}
