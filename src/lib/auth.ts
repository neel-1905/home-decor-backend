import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import * as schema from '../db/schema';
import { expo } from '@better-auth/expo';
import { ENV } from '@/config/env.config';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  plugins: [expo()],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  trustedOrigins: [
    'schema://',

    // Development mode - Expo's exp:// scheme with local IP ranges
    ...(ENV.NODE_ENV === 'development'
      ? [
          'exp://', // Trust any host of the exp:// scheme
          'exp://**', // Trust all Expo URLs (wildcard matching)
          'exp://192.168.*.*:*/**', // Trust 192.168.x.x IP range with any port and path
        ]
      : []),
  ],
});
