import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { SupabaseClient } from '@supabase/supabase-js';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: Message[];
  max_tokens?: number;
  temperature?: number;
}

interface ChatResponse {
  message: string;
  tokens_used: number;
}

@Injectable()
export class VeraService {
  private readonly logger = new Logger(VeraService.name);

  private readonly veraClient: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const baseURL = this.configService.get<string>('VERA_MODEL_SERVICE_URL', { infer: true }) ?? 'http://localhost:8000';

    this.veraClient = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.logger.log(`VERA service initialized with base URL ${baseURL}`);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.veraClient.get('/health');
      return response.data.status === 'healthy' && Boolean(response.data.model_loaded);
    } catch (error) {
      this.logger.error('VERA health check failed', error instanceof Error ? error.stack : undefined);
      return false;
    }
  }

  async chat(messages: Message[], options?: { maxTokens?: number; temperature?: number }): Promise<string> {
    const request: ChatRequest = {
      messages,
      max_tokens: options?.maxTokens ?? 512,
      temperature: options?.temperature ?? 0.7
    };

    try {
      this.logger.debug(`Sending ${messages.length} messages to VERA model`);
      const response = await this.veraClient.post<ChatResponse>('/chat', request);
      this.logger.debug(`VERA response received with ${response.data.tokens_used} tokens`);
      return response.data.message;
    } catch (error) {
      this.logger.error('Error calling VERA service', error instanceof Error ? error.stack : undefined);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === HttpStatus.SERVICE_UNAVAILABLE) {
          throw new HttpException('VERA model service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
        }

        if (error.code === 'ECONNREFUSED') {
          throw new HttpException('Cannot connect to VERA model service', HttpStatus.SERVICE_UNAVAILABLE);
        }
      }

      throw new HttpException('Failed to generate VERA response', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async chatWithContext(
    userId: string,
    conversationId: string,
    userMessage: string,
    supabase: SupabaseClient
  ): Promise<string> {
    try {
      const { data, error: historyError } = await supabase
        .from('messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(10);

      if (historyError) {
        this.logger.error('Failed to fetch conversation history', historyError);
        throw new HttpException('Failed to fetch conversation history', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      type HistoryRow = { role: string; content: string };
      const history = (data ?? []) as HistoryRow[];

      const messages: Message[] = [
        ...history.map((entry) => ({
          role: entry.role as 'user' | 'assistant',
          content: entry.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ];

      const response = await this.chat(messages);

      const [userInsert, assistantInsert] = await Promise.all([
        supabase.from('messages').insert({
          conversation_id: conversationId,
          user_id: userId,
          role: 'user',
          content: userMessage
        }),
        supabase.from('messages').insert({
          conversation_id: conversationId,
          user_id: userId,
          role: 'assistant',
          content: response
        })
      ]);

      if (userInsert.error || assistantInsert.error) {
        this.logger.error('Failed to persist chat messages', userInsert.error ?? assistantInsert.error);
        throw new HttpException('Failed to persist chat messages', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return response;
    } catch (error) {
      this.logger.error('Error while processing contextual chat', error instanceof Error ? error.stack : undefined);
      throw error instanceof HttpException
        ? error
        : new HttpException('Failed to generate contextual VERA response', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
