import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { Request } from 'express';
import { UserDataDto } from 'src/user/dto/user.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('add')
  createOrder(
    @Req() req: Request & { user_data: UserDataDto },
    @Body() body: any,
  ) {
    return this.orderService.createOrderService(req['user_data'].id, body);
  }
}
