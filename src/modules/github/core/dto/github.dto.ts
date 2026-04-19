export class LanguageDto {
  name!: string;
  color!: string;
  size!: number;
  percentage!: number;
}

export class PinnedRepoDto {
  name!: string;
  description!: string | null;
  url!: string;
  stars!: number;
  forks!: number;
  primaryLanguage!: string | null;
  primaryLanguageColor!: string | null;
  topics!: string[];
}

export class ContributionDayDto {
  date!: string;
  count!: number;
  level!: 0 | 1 | 2 | 3 | 4;
}

export class ContributionWeekDto {
  days!: ContributionDayDto[];
}

export class GithubStatsDto {
  totalRepositories: number;
  totalStars: number;
  totalCommitsThisYear: number;
  totalPRs: number;
  followers: number;
  languages: LanguageDto[];
  pinnedRepos: PinnedRepoDto[];
  contributionWeeks: ContributionWeekDto[];
}