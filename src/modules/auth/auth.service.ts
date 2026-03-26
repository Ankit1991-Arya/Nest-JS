import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, (user as any).password);
    if (match) {
      const { password, refreshToken, ...rest } = (user as any).toJSON();
      return rest;
    }
    return null;
  }

  async getTokens(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(user: any) {
    return this.getTokens(user);
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.getUserIfRefreshTokenMatches(refreshToken, userId);
    if (!user) throw new UnauthorizedException('Invalid refresh token');
    return this.getTokens(user);
  }

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
  }

  async register(data: any) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);
    const created = await this.usersService.create({ ...data, password: hash });
    return created;
  }
}
