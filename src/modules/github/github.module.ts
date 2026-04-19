import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { RedisModule } from '../../redis/redis.module';

@Module({
  imports: [ConfigModule, RedisModule],
  controllers: [GithubController],
  providers: [GithubService],
})

export class GithubModule {}