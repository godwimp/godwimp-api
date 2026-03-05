import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Controller('admin')
@UseGuards(ApiKeyGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Delete('cache')
  @HttpCode(HttpStatus.OK)
  clearAllCache() {
    return this.adminService.clearAllCache();
  }

  @Delete('cache/:key')
  @HttpCode(HttpStatus.OK)
  clearCacheByKey(@Param('key') key: string) {
    return this.adminService.clearCacheByPattern(key);
  }
}
