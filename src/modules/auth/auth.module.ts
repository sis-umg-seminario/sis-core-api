import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { RedisService } from './services/redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([Role, User, UserRole]),
  ],
  controllers: [AuthController],
  providers: [AuthService, RedisService],
  exports: [AuthService, TypeOrmModule],
})
export class AuthModule {}
