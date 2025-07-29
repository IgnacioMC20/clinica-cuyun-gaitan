import Fastify from 'fastify';
import cors from '@fastify/cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import plugins
import cookiesPlugin from './plugins/cookies';
import authPlugin from './plugins/auth';
import rateLimitingPlugin from './plugins/rateLimiting';

// Import routes
import routes from './routes';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

const app = Fastify({
    logger: true
});

async function start() {
    try {
        // Register CORS
        await app.register(cors, {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true
        });

        // Register plugins
        await app.register(rateLimitingPlugin);
        await app.register(cookiesPlugin);
        await app.register(authPlugin);

        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinica-medica';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Register routes
        await app.register(authRoutes, { prefix: '/api/auth' });
        await app.register(routes, { prefix: '/api' });

        // Health check
        app.get('/health', async (request, reply) => {
            return { status: 'ok', timestamp: new Date().toISOString() };
        });

        // Start server
        const port = parseInt(process.env.PORT || '3000');
        const host = process.env.HOST || '0.0.0.0';

        await app.listen({ port, host });
        console.log(`Server running on http://${host}:${port}`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    try {
        await app.close();
        await mongoose.disconnect();
        console.log('Server closed gracefully');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

start();