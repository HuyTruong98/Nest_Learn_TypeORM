import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDataDto } from 'src/user/dto/user.dto';
import { OrderService } from './order.service';

@ApiBearerAuth()
@ApiTags('Order')
@UseGuards(AuthGuard)
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
