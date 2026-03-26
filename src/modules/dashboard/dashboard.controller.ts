import { Controller, Get, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard, Roles } from "../auth/roles.guard";


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')

export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('summary')
    @Roles(['admin'])
    getStats() {
        return this.dashboardService.getSummary();
    }

    @Get('revenue/monthly')
    @Roles(['admin'])
    getMonthlyRevenue() {
        return this.dashboardService.getMonthlyRevenue();
    }

    @Get('top-products')
    @Roles(['admin'])
    getTopProducts() {
        return this.dashboardService.getTopProducts();
    }

    @Get('orders/status')
    @Roles(['admin'])
    getOrdersByStatus() {
        return this.dashboardService.getOrdersByStatus();
    }
}