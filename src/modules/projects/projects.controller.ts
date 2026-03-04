import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) return this.projectsService.findByCategory(category);
    return this.projectsService.findAll();
  }

  @Get('featured')
  findFeatured() {
    return this.projectsService.findFeatured();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }
}
