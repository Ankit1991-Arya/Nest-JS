import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard, Permissions, Roles, PermissionsGuard } from "../auth/roles.guard";


@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller('dashboard')

export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('summary')
    @Roles('admin')
    @Permissions('dashboard.read')
    getStats(@Req() req) {
        return this.dashboardService.getSummary(req.user.tenantId);
    }

    @Get('revenue/monthly')
    @Roles('admin')
    @Permissions('dashboard.read')
    getMonthlyRevenue(@Req() req) {
        return this.dashboardService.getMonthlyRevenue(req.user.tenantId);
    }

    @Get('top-products')
    @Roles('admin')
    @Permissions('dashboard.read')
    getTopProducts(@Req() req) {
        return this.dashboardService.getTopProducts(req.user.tenantId);
    }

    @Get('orders/status')
    @Roles('admin')
    @Permissions('dashboard.read')
    getOrdersByStatus(@Req() req) {
        return this.dashboardService.getOrdersByStatus(req.user.tenantId);
    }
}