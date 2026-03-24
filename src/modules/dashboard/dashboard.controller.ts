import { Controller, Get, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";


@UseGuards(JwtAuthGuard)
@Controller('dashboard')

export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('summary')
    getStats() {
        return this.dashboardService.getSummary();
    }

    @Get('revenue/monthly')
    getMonthlyRevenue() {
        return this.dashboardService.getMonthlyRevenue();
    }

    @Get('top-products')
    getTopProducts() {
        return this.dashboardService.getTopProducts();
    }

    @Get('orders/status')
    getOrdersByStatus() {
        return this.dashboardService.getOrdersByStatus();
    }
}