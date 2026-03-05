import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Module({
  controllers: [AdminController],
  providers: [AdminService, ApiKeyGuard],
})
export class AdminModule {}
