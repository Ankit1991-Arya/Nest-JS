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
  async getSummary() {
    const totalUsers = await this.userModel.count();
    const totalProducts = await this.productModel.count();
    const totalOrders = await this.orderModel.count();

    const totalRevenue = await this.orderModel.sum('totalAmount');

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue || 0,
    };
  }

  // 📅 Monthly Revenue
  async getMonthlyRevenue() {
    const result = await this.sequelize.query(
      `
      SELECT DATE_FORMAT(createdAt, '%Y-%m-01') AS month,
        SUM(totalAmount) AS revenue
      FROM 
        orders
      GROUP BY
        DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY 
        DATE_FORMAT(createdAt, '%Y-%m') ASC;
      `,
      { type: QueryTypes.SELECT },
    );

    return result;
  }

  // 🏆 Top Products
  async getTopProducts() {
    const result = await this.sequelize.query(
      `
      SELECT p.name,
             SUM(oi.quantity) AS total_sold
      FROM 
        order_items oi
      JOIN 
        products p ON p.id = oi.productId
      GROUP BY 
        p.name
      ORDER BY 
        total_sold DESC
      LIMIT 5;
      `,
      { type: QueryTypes.SELECT },
    );

    return result;
  }

  // 📦 Orders by Status
  async getOrdersByStatus() {
    const result = await this.sequelize.query(
      `
      SELECT 
        status, COUNT(*) as count
      FROM 
        orders
      GROUP BY
        status;
      `,
      { type: QueryTypes.SELECT },
    );

    return result;
  }
}