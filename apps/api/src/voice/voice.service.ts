import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type { AxiosResponse } from 'axios';

interface SynthesisOptions {
  text: string;
  voiceId?: string;
}

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);
  private readonly elevenLabsKey: string;
  private readonly defaultVoiceId: string;
  private readonly defaultModelId: string;

  constructor(private readonly http: HttpService, private readonly configService: ConfigService) {
    this.elevenLabsKey = this.configService.getOrThrow<string>('ELEVENLABS_API_KEY');
    this.defaultVoiceId = this.configService.getOrThrow<string>('ELEVENLABS_VOICE_ID');
    this.defaultModelId = this.configService.getOrThrow<string>('ELEVENLABS_MODEL_ID');
  }

  async synthesizeText({ text, voiceId }: SynthesisOptions) {
    const targetVoice = voiceId ?? this.defaultVoiceId;

    try {
      const response = await firstValueFrom<AxiosResponse<ArrayBuffer>>(
        this.http.post<ArrayBuffer>(
          `https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}`,
          {
            text,
            model_id: this.defaultModelId,
            voice_settings: {
              stability: 0.62,
              similarity_boost: 0.75
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': this.elevenLabsKey
            },
            responseType: 'arraybuffer'
          }
        )
      );

      const audioBuffer = Buffer.from(response.data);

      return {
        voiceId: targetVoice,
        modelId: this.defaultModelId,
        mimeType: 'audio/mpeg',
        audioBase64: audioBuffer.toString('base64'),
        size: audioBuffer.length
      };
    } catch (error) {
      this.logger.error('Failed to synthesize audio with ElevenLabs', error instanceof Error ? error.stack : error);
      throw new InternalServerErrorException('Unable to synthesize voice preview');
    }
  }
}
