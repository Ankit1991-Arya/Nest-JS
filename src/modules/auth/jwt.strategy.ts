import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'avyan#1804',
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.sub);
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role || user.role,
      tenantId: payload.tenantId || user.tenantId,
      permissions: payload.permissions || JSON.parse(user.permissions || '[]'),
    };
  }
}
