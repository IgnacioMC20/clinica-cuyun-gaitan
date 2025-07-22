import Fastify from 'fastify';
import mongoose from 'mongoose';
import routes from './routes';
import { config } from 'dotenv';

// Load environment variables
config({ path: '../.env.development' });

const app = Fastify({ logger: true });

// Register CORS
app.register(import('@fastify/cors'), {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
});

// Health check endpoint
app.get('/health', async (request, reply) => {
    return reply.send({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/clinic-dashboard?authSource=admin';

mongoose
    .connect(MONGODB_URI)
    .then(() => app.log.info('✅ Connected to MongoDB successfully'))
    .catch(err => {
        app.log.error('❌ MongoDB connection failed:', err);
        process.exit(1);
    });

// Register your routes as a plugin
app.register(routes, { prefix: '/api' });

// Global error handler
app.setErrorHandler((error, request, reply) => {
    request.log.error('Global error handler:', error);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const errors = Object.values((error as any).errors).map((err: any) => ({
            field: err.path,
            message: err.message
        }));
        return reply.status(400).send({
            error: 'Validation Error',
            message: 'Invalid data provided',
            details: errors,
            timestamp: new Date().toISOString()
        });
    }

    // Mongoose duplicate key error
    if ((error as any).code === 11000) {
        const field = Object.keys((error as any).keyPattern)[0];
        return reply.status(409).send({
            error: 'Duplicate Entry',
            message: `${field} already exists`,
            timestamp: new Date().toISOString()
        });
    }

    // Mongoose cast error
    if (error.name === 'CastError') {
        return reply.status(400).send({
            error: 'Invalid ID',
            message: 'Invalid ID format provided',
            timestamp: new Date().toISOString()
        });
    }

    // Default error
    reply.status(error.statusCode ?? 500).send({
        error: error.message || 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
        error: 'Not Found',
        message: `Route ${request.url} not found`,
        timestamp: new Date().toISOString()
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    app.log.info('🔄 Gracefully shutting down...');
    await mongoose.disconnect();
    app.log.info('✅ Database connection closed');
    process.exit(0);
});

// Start server
const start = async () => {
    try {
        const PORT = Number(process.env.PORT) || 4000;
        await app.listen({ port: PORT });
        app.log.info(`🚀 Server running on http://localhost:${PORT}`);
        app.log.info(`📊 Health check: http://localhost:${PORT}/health`);
        app.log.info(`🏥 API endpoints: http://localhost:${PORT}/api`);
    } catch (err) {
        app.log.error('❌ Failed to start server:', err);
        process.exit(1);
    }
};

start();