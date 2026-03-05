import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { CreateVisitDto } from './dto/visit.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('visit')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recordVisit(@Body() dto: CreateVisitDto, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.socket.remoteAddress ??
      '';
    const userAgent = req.headers['user-agent'] ?? '';
    await this.analyticsService.recordVisit(dto, ip, userAgent);
  }

  @Get('summary')
  @UseGuards(ApiKeyGuard)
  getSummary() {
    return this.analyticsService.getSummary();
  }
}
