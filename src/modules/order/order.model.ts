import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { OrderItem } from './order-item.model';

@Table({ tableName: 'orders' })
export class Order extends Model<Order> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  totalAmount: number;

  @Column({ defaultValue: 'PENDING' })
  status: string;

  @HasMany(() => OrderItem)
  items: OrderItem[];
}