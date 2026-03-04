export class ProjectResponseDto {
  id!: string;
  slug!: string;
  title!: string;
  description!: string;
  highlights!: string[];
  techStack!: string[];
  category!: string | null;
  isFeatured!: boolean;
  githubUrl!: string | null;
  liveUrl!: string | null;
  npmUrl!: string | null;
}

export type ProjectListResponseDto = ProjectResponseDto[];

export type ProjectSingleResponseDto = ProjectResponseDto;
