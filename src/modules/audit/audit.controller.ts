import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AuditService } from './audit.service';
import { RolesGuard, Roles, PermissionsGuard, Permissions } from '../auth/roles.guard';

@UseGuards(RolesGuard, PermissionsGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @Roles('admin')
  @Permissions('audit.read')
  async getAuditLogs(
    @Req() req,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const filters = {
      userId: userId ? parseInt(userId) : undefined,
      action,
      entityType,
      tenantId: req.user.tenantId,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    };

    return this.auditService.getAuditLogs(filters);
  }
}