import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsNotEmpty, MaxLength } from 'class-validator';
import {
  bodyCreateOrderProductsDto,
  bodyUpdateOrderProductsDto,
} from 'src/order-product/dto/order-product';

export class orderDto {
  @ApiProperty({ type: [bodyCreateOrderProductsDto] })
  @ArrayNotEmpty()
  @Type(() => bodyCreateOrderProductsDto)
  orderProducts: bodyCreateOrderProductsDto[];

  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(255)
  description?: string;
}

export class orderUpdateDto {
  @ApiProperty({ type: [bodyUpdateOrderProductsDto] })
  @ArrayNotEmpty()
  @Type(() => bodyUpdateOrderProductsDto)
  orderProducts: bodyUpdateOrderProductsDto[];

  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(255)
  description?: string;
}
