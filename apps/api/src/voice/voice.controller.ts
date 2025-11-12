import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';

import { VoiceService } from './voice.service';

const previewSchema = z.object({
  text: z.string().min(1, 'text is required'),
  voiceId: z.string().min(1).optional()
});

@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('preview')
  async createPreview(@Body() body: unknown) {
    const payload = previewSchema.parse(body);
    const result = await this.voiceService.synthesizeText(payload);

    return {
      ...result,
      audioUrl: `data:${result.mimeType};base64,${result.audioBase64}`
    };
  }
}
