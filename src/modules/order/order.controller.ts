import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder({ ...dto, tenantId: req.user.tenantId });
  }

  @Get()
  findAll(@Req() req) {
    return this.orderService.findAll(req.user.tenantId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.orderService.findOne(+id, req.user.tenantId);
  }
}