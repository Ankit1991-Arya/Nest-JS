import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async create(createUserDto: CreateUserDto) {
    const defaultPermissions = createUserDto.role === 'admin' ? ['dashboard.read', 'products.manage', 'orders.manage'] : ['products.read', 'orders.read'];
    const user = await this.userModel.create({
      ...createUserDto,
      tenantId: createUserDto.tenantId || 'default',
      permissions: JSON.stringify(createUserDto.permissions || defaultPermissions),
    });
    const { password, refreshToken, ...rest } = user.toJSON() as any;
    return rest;
  }

  findAll() {
    return this.userModel.findAll({ attributes: { exclude: ['password'] } });
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateDto = {
      ...updateUserDto,
      permissions: updateUserDto.permissions ? JSON.stringify(updateUserDto.permissions) : undefined,
    };
    await this.userModel.update(updateDto as any, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userModel.destroy({ where: { id } });
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
