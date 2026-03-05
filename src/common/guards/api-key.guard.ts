import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = (request.headers as Record<string, string>)['x-api-key'];
    const expected = this.config.get<string>('ADMIN_API_KEY');

    if (!expected || apiKey !== expected) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }
}
