import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { Product } from '../product/product.model';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectModel(OrderItem) private orderItemModel: typeof OrderItem,
    @InjectModel(Product) private productModel: typeof Product,
  ) {}

  async createOrder(dto: CreateOrderDto & { tenantId: string }) {
    let totalAmount = 0;

    const order = await this.orderModel.create({
      userId: dto.userId,
      totalAmount: 0,
      tenantId: dto.tenantId,
    });

    for (const item of dto.items) {
      const product = await this.productModel.findOne({
        where: { id: item.productId, tenantId: dto.tenantId },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      await this.orderItemModel.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    order.totalAmount = totalAmount;
    await order.save();

    return this.findOne(order.id, dto.tenantId);
  }

  findAll(tenantId: string) {
    return this.orderModel.findAll({
      where: { tenantId },
      include: [OrderItem],
    });
  }

  async findOne(id: number, tenantId: string) {
    const order = await this.orderModel.findOne({
      where: { id, tenantId },
      include: [OrderItem],
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}