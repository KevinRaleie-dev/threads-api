import 'express-session';

declare module 'express-session' {
  interface Session extends Partial<SessionData> {
    userId: number;
  }
}
