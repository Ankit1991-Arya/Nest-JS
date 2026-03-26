import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import { Product } from '../product/product.model';
import { Order } from '../order/order.model';
import { OrderItem } from '../order/order-item.model';
import { Sequelize, QueryTypes } from 'sequelize';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Product) private productModel: typeof Product,
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectConnection() private sequelize: Sequelize,
  ) {}

  // 📊 Summary
  async getSummary(tenantId: string) {
    const totalUsers = await this.userModel.count({ where: { tenantId } });
    const totalProducts = await this.productModel.count({ where: { tenantId } });
    const totalOrders = await this.orderModel.count({ where: { tenantId } });

    const totalRevenue = await this.orderModel.sum('totalAmount', { where: { tenantId } });

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue || 0,
    };
  }

  // 📅 Monthly Revenue
  async getMonthlyRevenue(tenantId: string) {
    const result = await this.sequelize.query(
      `
      SELECT DATE_FORMAT(createdAt, '%Y-%m-01') AS month,
             SUM(totalAmount) AS revenue
      FROM 
        orders
      WHERE tenantId = :tenantId
      GROUP BY
        DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY 
        DATE_FORMAT(createdAt, '%Y-%m') ASC;
      `,
      { type: QueryTypes.SELECT, replacements: { tenantId } },
    );

    return result;
  }

  // 🏆 Top Products
  async getTopProducts(tenantId: string) {
    const result = await this.sequelize.query(
      `
      SELECT p.name,
             SUM(oi.quantity) AS total_sold
      FROM 
        order_items oi
      JOIN 
        products p ON p.id = oi.productId
      WHERE
        oi.tenantId = :tenantId AND p.tenantId = :tenantId
      GROUP BY 
        p.name
      ORDER BY 
        total_sold DESC
      LIMIT 5;
      `,
      { type: QueryTypes.SELECT, replacements: { tenantId } },
    );

    return result;
  }

  // 📦 Orders by Status
  async getOrdersByStatus(tenantId: string) {
    const result = await this.sequelize.query(
      `
      SELECT 
        status, COUNT(*) as count
      FROM 
        orders
      WHERE tenantId = :tenantId
      GROUP BY
        status;
      `,
      { type: QueryTypes.SELECT, replacements: { tenantId } },
    );

    return result;
  }
}