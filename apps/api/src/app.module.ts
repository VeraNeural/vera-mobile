import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { validateEnv } from './config/env.validation';
import { HealthModule } from './health/health.module';
import { VoiceModule } from './voice/voice.module';
import { VeraModule } from './vera/vera.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv
    }),
    LoggerModule.forRoot({
      pinoHttp: {}
    }),
    HealthModule,
    VoiceModule,
    VeraModule
  ]
})
export class AppModule {}
