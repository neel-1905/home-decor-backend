import { UserSession } from '@thallesp/nestjs-better-auth';

declare global {
  namespace Express {
    interface Request {
      session?: UserSession;
    }
  }
}
