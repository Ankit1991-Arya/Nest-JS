import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private auditService: AuditService,
  ) {}

  async create(createUserDto: CreateUserDto, userId?: number, tenantId?: string) {
    const defaultPermissions = createUserDto.role === 'admin' ? ['dashboard.read', 'products.manage', 'orders.manage'] : ['products.read', 'orders.read'];
    const user = await this.userModel.create({
      ...createUserDto,
      tenantId: createUserDto.tenantId || tenantId || 'default',
      permissions: JSON.stringify(createUserDto.permissions || defaultPermissions),
    });
    const { password, refreshToken, ...rest } = user.toJSON() as any;

    // Audit log
    await this.auditService.log({
      userId,
      action: 'CREATE',
      entityType: 'User',
      entityId: user.id,
      newValues: rest,
      tenantId: user.tenantId,
    });

    return rest;
  }

  findAll(tenantId?: string) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    return this.userModel.findAll({
      where,
      attributes: { exclude: ['password', 'refreshToken'] }
    });
  }

  async findOne(id: number, tenantId?: string) {
    const where: any = { id };
    if (tenantId) where.tenantId = tenantId;

    const user = await this.userModel.findOne({
      where,
      attributes: { exclude: ['password', 'refreshToken'] }
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto, userId?: number, tenantId?: string) {
    const where: any = { id };
    if (tenantId) where.tenantId = tenantId;

    const existingUser = await this.userModel.findOne({ where });

    const updateDto = {
      ...updateUserDto,
      permissions: updateUserDto.permissions ? JSON.stringify(updateUserDto.permissions) : undefined,
    };
    await this.userModel.update(updateDto as any, { where });

    const updatedUser = await this.findOne(id, tenantId);

    // Audit log
    await this.auditService.log({
      userId,
      action: 'UPDATE',
      entityType: 'User',
      entityId: id,
      oldValues: existingUser?.toJSON(),
      newValues: updatedUser.toJSON(),
      tenantId: updatedUser.tenantId,
    });

    return updatedUser;
  }

  async remove(id: number, userId?: number, tenantId?: string) {
    const where: any = { id };
    if (tenantId) where.tenantId = tenantId;

    const user = await this.userModel.findOne({ where });
    await this.userModel.destroy({ where });

    // Audit log
    await this.auditService.log({
      userId,
      action: 'DELETE',
      entityType: 'User',
      entityId: id,
      oldValues: user?.toJSON(),
      tenantId: user?.tenantId,
    });

    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userModel.update({ refreshToken: hashed }, { where: { id: userId } });
  }

  async removeRefreshToken(userId: number) {
    await this.userModel.update({ refreshToken: null }, { where: { id: userId } });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user || !user.refreshToken) return null;
    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (isMatch) return user;
    return null;
  }
}
