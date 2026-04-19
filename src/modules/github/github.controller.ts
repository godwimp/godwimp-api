import { Controller, Get } from "@nestjs/common";
import { GithubService } from "./github.service";
import { GithubStatsDto } from "./core/dto/github.dto";

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get()
  getStats(): Promise<GithubStatsDto> {
    return this.githubService.getStats();
  }
}