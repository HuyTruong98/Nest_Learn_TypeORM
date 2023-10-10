import { IsNumber } from 'class-validator';

export class bodyOrderProductsDto {
  @IsNumber()
  postId: number;

  @IsNumber()
  quantity: number;
}
