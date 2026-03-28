import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const user = request.user;
    const method = request.method;
    const url = request.url;

    const startTime = Date.now();

    return next.handle().pipe(
      tap(async (data) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Extract entity information from URL pattern
        const entityMatch = url.match(/\/api\/(\w+)\/(\d+)?/);
        if (entityMatch) {
          const entityType = entityMatch[1];
          const entityId = entityMatch[2] ? parseInt(entityMatch[2]) : undefined;

          let action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' = 'CREATE';

          if (method === 'POST' && !entityId) action = 'CREATE';
          else if (method === 'PUT' || method === 'PATCH') action = 'UPDATE';
          else if (method === 'DELETE') action = 'DELETE';

          // Skip logging for GET requests and auth endpoints
          if (method !== 'GET' && !url.includes('/auth/')) {
            await this.auditService.log({
              userId: user?.userId,
              action,
              entityType,
              entityId,
              ipAddress: request.ip || request.connection?.remoteAddress,
              userAgent: request.get('User-Agent'),
              tenantId: user?.tenantId,
            });
          }
        }

        // Log auth actions
        if (url.includes('/auth/login') && method === 'POST' && response.statusCode === 201) {
          await this.auditService.log({
            userId: user?.userId,
            action: 'LOGIN',
            entityType: 'Auth',
            ipAddress: request.ip || request.connection?.remoteAddress,
            userAgent: request.get('User-Agent'),
            tenantId: user?.tenantId,
          });
        }

        if (url.includes('/auth/logout') && method === 'POST') {
          await this.auditService.log({
            userId: user?.userId,
            action: 'LOGOUT',
            entityType: 'Auth',
            ipAddress: request.ip || request.connection?.remoteAddress,
            userAgent: request.get('User-Agent'),
            tenantId: user?.tenantId,
          });
        }
      }),
    );
  }
}