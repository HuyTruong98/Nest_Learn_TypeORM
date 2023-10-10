import { bodyOrderProductsDto } from 'src/order-product/dto/order-product';

export class orderDto {
  orderProducts: bodyOrderProductsDto[];
  description?: string;
}
