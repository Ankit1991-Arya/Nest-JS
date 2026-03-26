import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'products' })
export class Product extends Model<Product> {
    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @Column({ type: DataType.FLOAT, allowNull: false })
    price: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    stock: number;

    @Column({ type: DataType.STRING, allowNull: false })
    tenantId: string;
}

