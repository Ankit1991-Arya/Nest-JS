import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { Product } from '../product/product.model';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem, Product])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}