import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, SupabaseClientOptions, createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;

  constructor(private readonly configService: ConfigService) {
    this.supabaseUrl = this.configService.get<string>('SUPABASE_URL', { infer: true }) ?? '';
    this.serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY', { infer: true }) ?? '';
  }

  getClient(accessToken?: string): SupabaseClient {
    const options: SupabaseClientOptions<'public'> = {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    };

    if (accessToken) {
      options.global = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };
    }

    return createClient(this.supabaseUrl, this.serviceRoleKey, options);
  }
}
