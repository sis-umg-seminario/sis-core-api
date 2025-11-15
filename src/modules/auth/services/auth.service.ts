import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '@auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private async validateUser(email: string, pass: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: [
        'student',
        'professor',
        'userRoles',
        'userRoles.role',
        'student.studentPrograms.program',
      ],
    });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const match = await bcrypt.compare(pass, user.password);
    if (!match) throw new UnauthorizedException('Credenciales inválidas');

    const userPayload = {
      userId: user.userId,
      email: user.email,
      roles: user.userRoles.map((ur) => ur.role.roleName),
      profileInformation: user.student || user.professor,
    };
    return userPayload;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const accessToken = this.createAccessToken(user);
    const refreshTokenResult = await this.createRefreshToken(null, user);
    return {
      accessToken,
      refreshToken: refreshTokenResult.token,
      refreshTokenExpiresIn: refreshTokenResult.expiresInSeconds,
    };
  }

  private createAccessToken(payload) {
    const accessPayload = { ...payload, type: 'access' };
    return this.jwtService.sign(accessPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '7d',
    });
  }

  private async createRefreshToken(payload, user: any) {
    const jti = uuidv4();
    const refreshPayload = {
      ...payload,
      jti,
      type: 'refresh',
    };
    const token = this.jwtService.sign(refreshPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const hashed = await bcrypt.hash(token, 10);
    const redisKey = `refresh:${user.id}:${jti}`;

    const ttlSeconds = 7 * 24 * 60 * 60;

    await this.redisService.getClient().set(redisKey, hashed, 'EX', ttlSeconds);

    return { token, jti, expiresInSeconds: ttlSeconds };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      }) as any;

      if (payload.type !== 'refresh') throw new Error('Not a refresh token');

      const userId = payload.sub;
      const jti = payload.jti;
      const redisKey = `refresh:${userId}:${jti}`;
      const storedHashed = await this.redisService.getClient().get(redisKey);
      if (!storedHashed)
        throw new UnauthorizedException('Refresh token revoked');

      const matches = await bcrypt.compare(refreshToken, storedHashed);
      if (!matches) throw new UnauthorizedException('Invalid refresh token');

      await this.redisService.getClient().del(redisKey);

      const accessToken = this.createAccessToken({
        id: userId,
        username: payload.username,
      });
      const refreshTokenResult = await this.createRefreshToken(null, {
        id: userId,
      });

      return {
        accessToken,
        refreshToken: refreshTokenResult.token,
        refreshTokenExpiresIn: refreshTokenResult.expiresInSeconds,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number, jti?: string) {
    if (jti) {
      const k = `refresh:${userId}:${jti}`;
      await this.redisService.getClient().del(k);
      return;
    }

    const client = this.redisService.getClient();
    const stream = client.scanStream({
      match: `refresh:${userId}:*`,
      count: 100,
    });
    const keys: string[] = [];
    for await (const resultKeys of stream) {
      if (resultKeys.length) keys.push(...resultKeys);
    }
    if (keys.length) await client.del(...keys);
  }
}
