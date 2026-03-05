import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateVisitDto } from './dto/visit.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async recordVisit(dto: CreateVisitDto, ip: string, userAgent: string) {
    await this.prisma.page_visits.create({
      data: {
        page: dto.page,
        referrer: dto.referrer ?? null,
        ip,
        user_agent: userAgent,
      },
    });
  }

  async getSummary() {
    const [total, perPage, perDay, topReferrers] = await Promise.all([
      // Total visits
      this.prisma.page_visits.count(),

      // Visits grouped by page
      this.prisma.page_visits.groupBy({
        by: ['page'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),

      // Visits per day — last 30 days
      this.prisma.$queryRaw<{ date: string; count: number }[]>`
        SELECT DATE(visited_at)::text AS date, COUNT(*)::int AS count
        FROM page_visits
        WHERE visited_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(visited_at)
        ORDER BY date DESC
      `,

      // Top referrers (excluding null/empty)
      this.prisma.page_visits.groupBy({
        by: ['referrer'],
        where: { referrer: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ]);

    return {
      total,
      perPage: perPage.map((r) => ({ page: r.page, count: r._count.id })),
      perDay,
      topReferrers: topReferrers.map((r) => ({
        referrer: r.referrer,
        count: r._count.id,
      })),
    };
  }
}
