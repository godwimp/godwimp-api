import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from 'src/common/prisma/prisma.service';
const CACHE_TTL = 300_000; // 5 minutes

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAll() {
    const cacheKey = 'projects:all';
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const data = await this.prisma.projects.findMany({
      orderBy: { order_index: 'asc' },
    });

    await this.cache.set(cacheKey, data, CACHE_TTL);
    return data;
  }

  async findFeatured() {
    const cacheKey = 'projects:featured';
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const data = await this.prisma.projects.findMany({
      where: { is_featured: true },
      orderBy: { order_index: 'asc' },
    });

    await this.cache.set(cacheKey, data, CACHE_TTL);
    return data;
  }

  async findByCategory(category: string) {
    const cacheKey = `projects:category:${category}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const data = await this.prisma.projects.findMany({
      where: { category },
      orderBy: { order_index: 'asc' },
    });

    await this.cache.set(cacheKey, data, CACHE_TTL);
    return data;
  }

  async findBySlug(slug: string) {
    const cacheKey = `projects:slug:${slug}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const data = await this.prisma.projects.findUnique({ where: { slug } });
    if (!data) throw new NotFoundException(`Project "${slug}" not found`);

    await this.cache.set(cacheKey, data, CACHE_TTL);
    return data;
  }

  private async invalidateCache() {
    const keys = ['projects:all', 'projects:featured'];
    await Promise.all(keys.map((k) => this.cache.del(k)));
  }
}
