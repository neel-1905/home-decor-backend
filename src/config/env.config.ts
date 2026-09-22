import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z
    .string()
    .refine(
      (port) => parseInt(port) > 0 && parseInt(port) < 65536,
      'Invalid port number',
    ),

  NODE_ENV: z.enum(['development', 'production', 'staging', 'local']),

  DATABASE_URL: z.url('Invalid database URL'),

  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),

  BETTER_AUTH_URL: z.url('Invalid Better Auth URL'),
});

type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
