import { FastifyRequest, FastifyReply, preHandlerHookHandler } from 'fastify';
import { blue, red, underline, yellowBright } from 'colorette';

export function requireAuth(roles?: string[]): preHandlerHookHandler {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        console.log(blue('=== RequireAuth Middleware ==='));
        console.log(underline(`URL: ${request.url}`));
        console.log(underline(`Method: ${request.method}`));
        console.log(underline(`Cookies: ${JSON.stringify(request.cookies)}`));
        console.log(underline(`User: ${JSON.stringify(request.user)}`));

        if (!request.user) {
            console.log(red('No user found, returning 401'));
            return reply.code(401).send({
                error: 'Unauthorized',
                message: 'Authentication required'
            });
        }

        if (roles && roles.length > 0 && !roles.includes(request.user.role)) {
            console.log(yellowBright(`User role ${request.user.role} not in required roles: [${roles.join(', ')}]`));
            return reply.code(403).send({
                error: 'Forbidden',
                message: 'Insufficient permissions'
            });
        }

        console.log(blue('Auth check passed'));
    };
}

export function requireRole(role: string) {
    return requireAuth([role]);
}

export function requireAnyRole(roles: string[]) {
    return requireAuth(roles);
}
