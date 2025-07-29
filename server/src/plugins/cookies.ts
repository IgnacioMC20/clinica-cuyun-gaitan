import fp from 'fastify-plugin';
import fastifyCookie from 'fastify-cookie';

export default fp(async (app) => {
    app.register(fastifyCookie, {
        secret: process.env.COOKIE_SECRET!, // for signed cookies
        parseOptions: {
            sameSite: 'lax',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        }
    });
});