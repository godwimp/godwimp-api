import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

const PROJECT_CACHE_KEYS = [
  'projects:all',
  'projects:featured',
];

@Injectable()
export class AdminService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async clearAllCache(): Promise<{ cleared: string[] }> {
    // Get category cache keys stored during runtime
    const allKeys: string[] = [...PROJECT_CACHE_KEYS];

    await Promise.all(allKeys.map((key) => this.cache.del(key)));

    return { cleared: allKeys };
  }

  async clearCacheByPattern(pattern: string): Promise<{ cleared: string }> {
    await this.cache.del(pattern);
    return { cleared: pattern };
  }
}
