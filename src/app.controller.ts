import { Controller, Get, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health/redis')
  async redisHealth(): Promise<{ status: string; ping: string }> {
    const ping = await this.redisService.getClient().ping();
    return { status: 'ok', ping };
  }

  @Get('health/cache')
  async cacheHealth(): Promise<{ status: string; value: string }> {
    await this.cacheManager.set('health_check', 'pong');
    const value = await this.cacheManager.get<string>('health_check');
    return { status: 'ok', value: value ?? 'miss' };
  }
}
