import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SupabaseModule } from '../supabase/supabase.module';
import { AuthGuard } from '../auth/auth.guard';
import { VeraController } from './vera.controller';
import { VeraService } from './vera.service';

@Module({
  imports: [ConfigModule, SupabaseModule],
  controllers: [VeraController],
  providers: [VeraService, AuthGuard],
  exports: [VeraService]
})
export class VeraModule {}
