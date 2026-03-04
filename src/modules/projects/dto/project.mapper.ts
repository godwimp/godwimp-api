import { projects } from '@prisma/client';
import { ProjectResponseDto, ProjectListResponseDto, ProjectSingleResponseDto } from './project-response.dto';

export function toProjectDto(project: projects): ProjectResponseDto {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    highlights: project.highlights,
    techStack: project.tech_stack,
    category: project.category ?? null,
    isFeatured: project.is_featured,
    githubUrl: project.github_url ?? null,
    liveUrl: project.live_url ?? null,
    npmUrl: project.npm_url ?? null,
  };
}

export function toProjectListResponse(projects: projects[]): ProjectListResponseDto {
  return { data: projects.map(toProjectDto) };
}

export function toProjectSingleResponse(project: projects): ProjectSingleResponseDto {
  return { data: toProjectDto(project) };
}
