# Guide: Migrating Your Express Backend to Fastify

This guide will walk you through upgrading the `server/` portion of your monorepo from Express to Fastify (v4+), using TypeScript and your existing Mongoose setup.

---

## 1. Install Fastify & Plugins

In your `server/` folder, remove Express and install Fastify:

```bash
cd server
# Remove Express (optional)
yarn remove express @types/express
# Install Fastify core + common plugins
yarn add fastify @fastify/cors fastify-plugin dotenv
# (Optional) For schema‐based validation:
yarn add @fastify/ajv-compiler
# Dev tools
yarn add -D @types/node ts-node typescript
```

## 2. Update TypeScript Config

In `server/tsconfig.json`, ensure compatibility:

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

## 3. Bootstrap Fastify Server

Replace `src/index.ts` with:

```typescript
// src/index.ts
import Fastify from 'fastify';
import mongoose from 'mongoose';
import routes from './routes';
import { config } from 'dotenv';

config(); // load .env

const app = Fastify({ logger: true });

// Register CORS
app.register(import('@fastify/cors'), {
  origin: true,
  methods: ['GET','POST','PUT','DELETE']
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => app.log.info('MongoDB connected'))
  .catch(err => app.log.error(err));

// Register your routes as a plugin
app.register(routes, { prefix: '/api' });

// Global error handler (optional)
app.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  reply.status(error.statusCode ?? 500).send({
    error: error.message || 'Internal Server Error'
  });
});

// Start server
const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 4000 });
    app.log.info(`Server listening at ${app.server.address()}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
```

## 4. Convert Routes

In `src/routes.ts`, rewrite Express router to Fastify plugin:

```typescript
// src/routes.ts
import { FastifyPluginAsync } from 'fastify';
import { Patient } from './models/Patient';

const routes: FastifyPluginAsync = async (app) => {
  // GET /api/stats
  app.get('/stats', async (_, reply) => {
    const total    = await Patient.countDocuments();
    const male     = await Patient.countDocuments({ gender: 'male' });
    const female   = await Patient.countDocuments({ gender: 'female' });
    const children = await Patient.countDocuments({ gender: 'child' });
    return reply.send({ total, male, female, children });
  });

  // CRUD endpoints
  app.post('/patients', async (request, reply) => {
    const created = await Patient.create(request.body as any);
    return reply.code(201).send(created);
  });

  app.get('/patients', async (_, reply) => {
    const list = await Patient.find();
    return reply.send(list);
  });

  app.get('/patients/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const patient = await Patient.findById(id);
    if (!patient) return reply.code(404).send({ error: 'Not found' });
    return reply.send(patient);
  });

  app.put('/patients/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const updated = await Patient.findByIdAndUpdate(id, request.body, { new: true });
    if (!updated) return reply.code(404).send({ error: 'Not found' });
    return reply.send(updated);
  });

  app.delete('/patients/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await Patient.findByIdAndDelete(id);
    return reply.code(204).send();
  });
};

export default routes;
```

## 5. Update package.json Scripts

In `server/package.json`, replace your start/dev scripts:

```json
{
  "scripts": {
    "dev": "ts-node --prefer-ts-exts src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## 6. Test & Validate

**Run in dev mode:**

```bash
yarn dev
```

**Smoke‑test endpoints** (e.g. with Postman or curl)

**Check logs** — Fastify's built‑in logger shows request timing.

## 7. (Optional) Leverage Fastify Features

- **Schema validation**: define JSON schemas per route for input/output.
- **Plugins**: split large route files into modular Fastify plugins.
- **Lifecycle hooks**: use `onRequest`, `preHandler`, etc., for auth or validation.