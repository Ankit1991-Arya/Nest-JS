import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table({ tableName: 'audit_logs' })
export class AuditLog extends Model<AuditLog> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  userId: number;

  @Column({ type: DataType.ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'), allowNull: false })
  action: string;

  @Column({ type: DataType.STRING, allowNull: false })
  entityType: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  entityId: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  oldValues: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  newValues: string;

  @Column({ type: DataType.STRING, allowNull: true })
  ipAddress: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  userAgent: string;

  @Column({ type: DataType.STRING, allowNull: true })
  tenantId: string;

  @BelongsTo(() => User)
  user: User;
}