import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLog } from './audit-log.model';

export interface AuditLogData {
  userId?: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entityType: string;
  entityId?: number;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  tenantId?: string;
}

@Injectable()
export class AuditService {
  constructor(@InjectModel(AuditLog) private auditLogModel: typeof AuditLog) {}

  async log(auditData: AuditLogData): Promise<void> {
    try {
      await this.auditLogModel.create({
        userId: auditData.userId,
        action: auditData.action,
        entityType: auditData.entityType,
        entityId: auditData.entityId,
        oldValues: auditData.oldValues ? JSON.stringify(auditData.oldValues) : null,
        newValues: auditData.newValues ? JSON.stringify(auditData.newValues) : null,
        ipAddress: auditData.ipAddress,
        userAgent: auditData.userAgent,
        tenantId: auditData.tenantId,
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw error to avoid breaking the main operation
    }
  }

  async getAuditLogs(filters?: {
    userId?: number;
    action?: string;
    entityType?: string;
    tenantId?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.userId) where.userId = filters.userId;
    if (filters?.action) where.action = filters.action;
    if (filters?.entityType) where.entityType = filters.entityType;
    if (filters?.tenantId) where.tenantId = filters.tenantId;

    return this.auditLogModel.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: filters?.limit || 50,
      offset: filters?.offset || 0,
      include: [{
        model: require('../user/user.model').User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
    });
  }
}