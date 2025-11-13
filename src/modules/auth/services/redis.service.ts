import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis/built/Redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: parseInt(
        this.configService.get<string>('REDIS_PORT') as string,
        10,
      ),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
  }

  getClient() {
    return this.redisClient;
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
