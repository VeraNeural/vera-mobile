"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().int().min(0).max(65535).default(3001),
    LOG_LEVEL: zod_1.z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    ELEVENLABS_API_KEY: zod_1.z.string().min(1, 'ELEVENLABS_API_KEY is required'),
    ELEVENLABS_VOICE_ID: zod_1.z
        .string()
        .min(1)
        .default('ROMJ9yK1NAMuu1ggrjDW'),
    ELEVENLABS_MODEL_ID: zod_1.z.string().min(1).default('eleven_multilingual_v2'),
    SUPABASE_URL: zod_1.z.string().url('SUPABASE_URL must be a valid URL'),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
    VERA_MODEL_SERVICE_URL: zod_1.z
        .string()
        .url('VERA_MODEL_SERVICE_URL must be a valid URL')
        .default('http://localhost:8000')
});
const validateEnv = (config) => exports.envSchema.parse(config);
exports.validateEnv = validateEnv;
