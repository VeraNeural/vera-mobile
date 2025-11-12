import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { VoiceService } from './voice.service';
import { VoiceController } from './voice.controller';

@Module({
  imports: [ConfigModule, HttpModule.register({ timeout: 10_000 })],
  controllers: [VoiceController],
  providers: [VoiceService],
  exports: [VoiceService]
})
export class VoiceModule {}
