import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Post } from 'src/post/entities/post.entity';
import { Repository } from 'typeorm';
import {
  bodyCreateOrderProductsDto,
  bodyUpdateOrderProductsDto,
} from './dto/order-product';
import { OrderProduct } from './entities/order-product.entity';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async createProducts(
    orderId: number,
    products: bodyCreateOrderProductsDto[],
  ) {
    const items = products.map((e) => {
      return {
        order: { id: orderId },
        post: { id: e.postId },
        quantity: e.quantity,
      } as OrderProduct;
    });
    for (const detail of items) {
      const postById = await this.postRepository.findOneBy({
        id: detail.post.id,
      });

      if (postById) {
        await this.postRepository.update(
          { id: detail.post.id },
          {
            quantity: postById.quantity - detail.quantity,
          },
        );
      }
    }

    return await this.orderProductRepository.save(items);
  }

  async updateProducts(
    newProducts: bodyUpdateOrderProductsDto[],
    oldProducts: bodyUpdateOrderProductsDto[],
  ) {
    newProducts.forEach(async (newProduct) => {
      const correspondingOldProduct = oldProducts.find(
        (oldProduct) => oldProduct.postId === newProduct.postId,
      );

      const newQuantity =
        newProduct.quantity !== correspondingOldProduct.quantity
          ? (correspondingOldProduct ? correspondingOldProduct.quantity : 0) -
            newProduct.quantity
          : correspondingOldProduct.quantity;

      const postId = await this.postRepository.findOneBy({
        id: newProduct.postId,
      });

      await this.postRepository.update(
        { id: newProduct.postId },
        {
          quantity:
            newProduct.quantity !== correspondingOldProduct.quantity
              ? postId.quantity + newQuantity
              : postId.quantity,
          modDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        },
      );
    });

    return newProducts.forEach(async (x) => {
      await this.orderProductRepository.update(x.id, {
        quantity: x.quantity,
      });
    });
  }
}
