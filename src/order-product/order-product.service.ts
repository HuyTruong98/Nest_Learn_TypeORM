import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { bodyOrderProductsDto } from './dto/order-product';
import { OrderProduct } from './entities/order-product.entity';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
  ) {}

  async createProducts(orderId: number, products: bodyOrderProductsDto[]) {
    const items = products.map((e) => {
      return {
        order: { id: orderId },
        post: { id: e.postId },
        quantity: e.quantity,
      } as OrderProduct;
    });
    return await this.orderProductRepository.save(items);
  }
}
