import { Env } from './env.validation';

export const appConfig = (env: Env) => ({
  isProduction: env.NODE_ENV === 'production',
  port: env.PORT,
  logLevel: env.LOG_LEVEL
});
