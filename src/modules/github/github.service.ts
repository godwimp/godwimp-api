import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../redis/redis.service';
import {
  GithubStatsDto,
  LanguageDto,
  PinnedRepoDto,
  ContributionWeekDto,
  ContributionDayDto,
} from './core/dto/github.dto';
import { GITHUB_STATS_QUERY } from './core/query/github.query';

const CACHE_KEY = 'github:stats';
const CACHE_TTL_SECONDS = 6 * 60 * 60; // 6 hours

// Map GraphQL contributionLevel enum → numeric level 0-4
const LEVEL_MAP: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  private readonly username: string;
  private readonly pat: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.username = this.configService.getOrThrow<string>('GITHUB_USERNAME');
    this.pat = this.configService.getOrThrow<string>('GITHUB_PAT');
  }

  async getStats(): Promise<GithubStatsDto> {
    const redis = this.redisService.getClient();

    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      this.logger.debug('GitHub stats served from cache');
      return JSON.parse(cached) as GithubStatsDto;
    }

    const stats = await this.fetchFromGithub();
    await redis.set(CACHE_KEY, JSON.stringify(stats), 'EX', CACHE_TTL_SECONDS);
    return stats;
  }

  private async fetchFromGithub(): Promise<GithubStatsDto> {
    const now = new Date();
    const from = new Date(now.getFullYear(), 0, 1).toISOString(); // Jan 1 current year
    const to = now.toISOString();

    let response: Response;
    try {
      response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.pat}`,
          'User-Agent': 'godwimp-portfolio',
        },
        body: JSON.stringify({
          query: GITHUB_STATS_QUERY,
          variables: { username: this.username, from, to },
        }),
      });
    } catch (err) {
      this.logger.error('GitHub API network error', err);
      throw new InternalServerErrorException('Failed to reach GitHub API');
    }

    if (!response.ok) {
      this.logger.error(`GitHub API responded with ${response.status}`);
      throw new InternalServerErrorException('GitHub API error');
    }

    const json = await response.json();

    if (json.errors?.length) {
      this.logger.error('GitHub GraphQL errors', json.errors);
      throw new InternalServerErrorException('GitHub GraphQL error');
    }

    return this.transform(json.data.user);
  }

  private transform(user: any): GithubStatsDto {
    // --- Language aggregation ---
    const langMap = new Map<string, { color: string; size: number }>();
    for (const repo of user.repositories.nodes) {
      for (const edge of repo.languages.edges) {
        const { name, color } = edge.node;
        const existing = langMap.get(name);
        if (existing) {
          existing.size += edge.size;
        } else {
          langMap.set(name, { color: color ?? '#ccc', size: edge.size });
        }
      }
    }

    const totalSize = [...langMap.values()].reduce((sum, l) => sum + l.size, 0);
    const languages: LanguageDto[] = [...langMap.entries()]
      .sort((a, b) => b[1].size - a[1].size)
      .slice(0, 8) // top 8 languages
      .map(([name, { color, size }]) => ({
        name,
        color,
        size,
        percentage: totalSize > 0 ? Math.round((size / totalSize) * 1000) / 10 : 0,
      }));

    // --- Pinned repos ---
    const pinnedRepos: PinnedRepoDto[] = user.pinnedItems.nodes.map((repo: any) => ({
      name: repo.name,
      description: repo.description ?? null,
      url: repo.url,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      primaryLanguage: repo.primaryLanguage?.name ?? null,
      primaryLanguageColor: repo.primaryLanguage?.color ?? null,
      topics: repo.repositoryTopics.nodes.map((n: any) => n.topic.name),
    }));

    // --- Contribution calendar ---
    const contributionWeeks: ContributionWeekDto[] =
      user.contributionsCollection.contributionCalendar.weeks.map((week: any) => ({
        days: week.contributionDays.map(
          (day: any): ContributionDayDto => ({
            date: day.date,
            count: day.contributionCount,
            level: LEVEL_MAP[day.contributionLevel] ?? 0,
          }),
        ),
      }));

    // --- Total stars ---
    const totalStars = user.repositories.nodes.reduce(
      (sum: number, r: any) => sum + r.stargazerCount,
      0,
    );

    return {
      totalRepositories: user.repositories.totalCount,
      totalStars,
      totalCommitsThisYear: user.contributionsCollection.totalCommitContributions,
      totalPRs: user.contributionsCollection.totalPullRequestContributions,
      followers: user.followers.totalCount,
      languages,
      pinnedRepos,
      contributionWeeks,
    };
  }
}