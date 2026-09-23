import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import * as schema from '../db/schema';
import { expo } from '@better-auth/expo';
import { ENV } from '@/config/env.config';
import { eq, sql } from 'drizzle-orm';
import { log } from 'node:console';

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
  user: {
    additionalFields: {
      mobile: {
        type: 'string',
        required: true, // Requires it during registration
      },
      dob: {
        type: 'string', // Matches our mode: 'string' configuration from earlier
        required: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const [{ count }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(schema.user);

          const roleName = Number(count) <= 1 ? 'Admin' : 'User';

          const [assignedRole] = await db
            .select({ id: schema.role.id })
            .from(schema.role)
            .where(eq(schema.role.name, roleName))
            .limit(1);

          if (!assignedRole) {
            throw new Error(
              `${roleName} role not found. Run the RBAC seed first.`,
            );
          }

          await db
            .update(schema.user)
            .set({ roleId: assignedRole.id })
            .where(eq(schema.user.id, user.id));
        },
      },
    },
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
