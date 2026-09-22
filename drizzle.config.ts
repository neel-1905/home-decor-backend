// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import { ENV } from '@config/env.config';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
});
