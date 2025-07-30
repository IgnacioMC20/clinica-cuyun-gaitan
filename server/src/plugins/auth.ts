import fp from 'fastify-plugin';
import { auth, SessionUser, SessionData } from '../auth/lucia';

export default fp(async (app) => {
  app.decorate('auth', auth);

  app.addHook('preHandler', async (request, reply) => {
    try {
      // Debug logging
      console.log('=== Auth PreHandler Debug ===');
      console.log('Request URL:', request.url);
      console.log('Request cookies:', request.cookies);
      console.log('Raw headers:', request.headers.cookie);

      const sessionId = request.cookies?.session || '';
      console.log('Session ID from cookie:', sessionId);

      if (!sessionId) {
        console.log('No session ID found in cookies');
        request.user = null;
        request.session = null;
        return;
      }

      const { session, user } = await auth.validateSession(sessionId);
      console.log('Session validation result:', { session: !!session, user: !!user });

      if (user) {
        console.log('User found:', { id: user.id, email: user.email, role: user.role });
      }

      request.user = user;
      request.session = session;
    } catch (error) {
      console.error('Auth preHandler error:', error);
      request.user = null;
      request.session = null;
    }
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