import fp from 'fastify-plugin';
import { auth, SessionUser, SessionData } from '../auth/lucia';

export default fp(async (app) => {
  app.decorate('auth', auth);

  app.addHook('preHandler', async (request, reply) => {
    const sessionId = request.cookies?.session ?? '';
    const { session, user } = await auth.validateSession(sessionId);

    request.user = user;
    request.session = session;
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    auth: typeof auth;
  }
  interface FastifyRequest {
    user: SessionUser | null;
    session: SessionData | null;
    cookies: { [key: string]: string };
  }
}