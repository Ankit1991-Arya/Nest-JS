import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';
import { Order } from '../order/order.model';
import { OrderItem } from '../order/order-item.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Product, Order, OrderItem]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}