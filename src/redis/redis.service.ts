import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined in environment variables');
    }

    // ioredis auto-detects TLS from rediss:// scheme (Upstash)
    this.client = new Redis(redisUrl);

    this.client.on('connect', () => this.logger.log('Redis connected'));
    this.client.on('error', (err) => this.logger.error('Redis error', err));

    await this.testConnection();
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis connection closed');
  }

  private async testConnection() {
    try {
      const pong = await this.client.ping();
      this.logger.log(`Redis PING → ${pong}`);
    } catch (err) {
      this.logger.error('Redis connection failed', err);
    }
  }

  getClient(): Redis {
    return this.client;
  }
}
