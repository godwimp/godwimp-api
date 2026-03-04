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

export class ProjectListResponseDto {
  data!: ProjectResponseDto[];
}

export class ProjectSingleResponseDto {
  data!: ProjectResponseDto;
}
