import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  toProjectListResponse,
  toProjectSingleResponse,
} from './dto/project.mapper';
import type { ProjectListResponseDto, ProjectSingleResponseDto } from './dto/project-response.dto';

const CACHE_TTL = 3_600_000; // 1 hour

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAll(): Promise<ProjectListResponseDto> {
    const cacheKey = 'projects:all';
    const cached = await this.cache.get<ProjectListResponseDto>(cacheKey);
    if (cached) return cached;

    const rows = await this.prisma.projects.findMany({
      orderBy: { order_index: 'asc' },
    });
    const result = toProjectListResponse(rows);

    await this.cache.set(cacheKey, result, CACHE_TTL);
    return result;
  }

  async findFeatured(): Promise<ProjectListResponseDto> {
    const cacheKey = 'projects:featured';
    const cached = await this.cache.get<ProjectListResponseDto>(cacheKey);
    if (cached) return cached;

    const rows = await this.prisma.projects.findMany({
      where: { is_featured: true },
      orderBy: { order_index: 'asc' },
    });
    const result = toProjectListResponse(rows);

    await this.cache.set(cacheKey, result, CACHE_TTL);
    return result;
  }

  async findByCategory(category: string): Promise<ProjectListResponseDto> {
    const cacheKey = `projects:category:${category}`;
    const cached = await this.cache.get<ProjectListResponseDto>(cacheKey);
    if (cached) return cached;

    const rows = await this.prisma.projects.findMany({
      where: { category },
      orderBy: { order_index: 'asc' },
    });
    const result = toProjectListResponse(rows);

    await this.cache.set(cacheKey, result, CACHE_TTL);
    return result;
  }

  async findBySlug(slug: string): Promise<ProjectSingleResponseDto> {
    const cacheKey = `projects:slug:${slug}`;
    const cached = await this.cache.get<ProjectSingleResponseDto>(cacheKey);
    if (cached) return cached;

    const row = await this.prisma.projects.findUnique({ where: { slug } });
    if (!row) throw new NotFoundException(`Project "${slug}" not found`);

    const result = toProjectSingleResponse(row);

    await this.cache.set(cacheKey, result, CACHE_TTL);
    return result;
  }

  private async invalidateCache() {
    const keys = ['projects:all', 'projects:featured'];
    await Promise.all(keys.map((k) => this.cache.del(k)));
  }
}
