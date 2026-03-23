import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Order } from './order.model';
import { Product } from '../product/product.model';

@Table({ tableName: 'order_items' })
export class OrderItem extends Model<OrderItem> {
  @ForeignKey(() => Order)
  @Column
  orderId: number;

  @ForeignKey(() => Product)
  @Column
  productId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  price: number;
}