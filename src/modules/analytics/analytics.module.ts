import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, ApiKeyGuard],
})
export class AnalyticsModule {}
