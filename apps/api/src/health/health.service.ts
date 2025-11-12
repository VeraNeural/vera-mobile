import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  getStatus() {
    const environment = this.configService.get<string>('NODE_ENV', { infer: true }) ?? 'unknown';
    const port = this.configService.get<number>('PORT', { infer: true });
    return {
      status: 'ok',
      environment,
      port: port ?? null,
      timestamp: new Date().toISOString()
    };
  }
}
