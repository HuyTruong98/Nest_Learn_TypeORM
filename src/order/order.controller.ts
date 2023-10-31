import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDataDto } from 'src/user/dto/user.dto';
import { orderDto, orderUpdateDto } from './dto/order';
import { Order } from './entities/order.entity';
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
    @Body() body: orderDto,
  ) {
    return this.orderService.createOrderService(req['user_data'].id, body);
  }

  @Get('/:id')
  getOrders(@Param('id') param: number): Promise<Order> {
    return this.orderService.getOrderById(param);
  }

  @Put('/:id')
  updateById(
    @Param('id') id: number,
    @Body() body: orderUpdateDto,
    @Req() req: Request & { user_data: UserDataDto },
  ) {
    return this.orderService.updateOrderService(req['user_data'].id, id, body);
  }
}
