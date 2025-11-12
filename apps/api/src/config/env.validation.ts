import { z } from 'zod';

// Defines and validates the environment variables needed by the API.
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(0).max(65535).default(3001),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  ELEVENLABS_API_KEY: z.string().min(1, 'ELEVENLABS_API_KEY is required'),
  ELEVENLABS_VOICE_ID: z
    .string()
    .min(1)
    .default('uYXf8XasLslADfZ2MB4u'),
  ELEVENLABS_MODEL_ID: z.string().min(1).default('eleven_turbo_v2'),
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  VERA_MODEL_SERVICE_URL: z
    .string()
    .url('VERA_MODEL_SERVICE_URL must be a valid URL')
    .default('http://localhost:8000')
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>): Env => envSchema.parse(config);
