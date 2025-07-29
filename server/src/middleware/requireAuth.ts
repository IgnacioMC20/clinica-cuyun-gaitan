import { FastifyRequest, FastifyReply } from 'fastify';

export function requireAuth(roles?: string[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        if (!request.user) {
            return reply.code(401).send({
                error: 'Unauthorized',
                message: 'Authentication required'
            });
        }

        if (roles && roles.length > 0 && !roles.includes(request.user.role)) {
            return reply.code(403).send({
                error: 'Forbidden',
                message: 'Insufficient permissions'
            });
        }
    };
}

export function requireRole(role: string) {
    return requireAuth([role]);
}

export function requireAnyRole(roles: string[]) {
    return requireAuth(roles);
}