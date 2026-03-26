import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 18 })
  age: number;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.ENUM('admin', 'user'), defaultValue: 'user' })
  role: string;

  @Column({ type: DataType.STRING, allowNull: true })
  refreshToken?: string;
}

