import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { SupabaseService } from '../supabase/supabase.service';
import { VeraService } from './vera.service';

class ChatDto {
  conversationId!: string;
  message!: string;
}

@Controller('vera')
@UseGuards(AuthGuard)
export class VeraController {
  constructor(
    private readonly veraService: VeraService,
    private readonly supabaseService: SupabaseService
  ) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  async health() {
    const isHealthy = await this.veraService.healthCheck();
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString()
    };
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Req() req: any, @Body() body: ChatDto) {
    const { conversationId, message } = body;

    const userId = req.user?.id ?? 'anonymous-user';
    const accessToken = req.user?.accessToken;

    const supabase = this.supabaseService.getClient(accessToken);
    const response = await this.veraService.chatWithContext(userId, conversationId, message, supabase);

    return {
      message: response,
      timestamp: new Date().toISOString()
    };
  }
}
