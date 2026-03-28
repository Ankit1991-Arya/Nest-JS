import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.model';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    AuditModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
