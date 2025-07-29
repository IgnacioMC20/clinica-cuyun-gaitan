# Authentication Plan (Lucia + Fastify + MongoDB)

## Why Lucia?
- **Framework-agnostic**: Works with Fastify, Vite React, SSR or SPA.
- **Type-safe**: First-class TS types for User/Session.
- **Storage-agnostic**: Bring your own DB (we’ll use MongoDB/Mongoose).
- **Session cookies by default**: Secure, httpOnly, signed cookies instead of DIY JWT plumbing.
- **Adapters & examples**: Official adapters for many stacks, easy to write your own.

> Alternatives:
> - **Auth.js (NextAuth v5 core)**: Great but heavier & more Next-focused.
> - **Clerk / Auth0 / Supabase**: SaaS convenience but adds monthly cost and vendor lock-in.
> - **Passport.js**: Mature but verbose, weak TS DX, and better for OAuth strategies only.

---

## High-Level Flow

1. **User Signup/Login** → POST from UI → Fastify route
2. Validate credentials → Hash password → Store/Retrieve user
3. Create session via Lucia → Set secure cookie
4. Frontend uses TanStack Query to call `/me` and get user profile
5. Protected endpoints check Lucia session in a Fastify preHandler

---

## Steps

### Part 1 – Install & Configure

```bash
cd server
yarn add lucia @lucia-auth/adapter-mongoose fastify-cookie fastify-plugin argon2
yarn add -D @types/cookie
# argon2 (or bcrypt) for password hashing
```

#### 1.1 Add Cookie Support

```ts
// server/src/plugins/cookies.ts
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
```

#### 1.2 Lucia Setup

```ts
// server/src/auth/lucia.ts
import { lucia } from 'lucia';
import { mongooseAdapter } from '@lucia-auth/adapter-mongoose';
import { User, Session } from '../models/authModels'; // We'll create these

export const auth = lucia({
  adapter: mongooseAdapter(User, Session),
  env: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
  sessionCookie: {
    name: 'session',
    attributes: {
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    }
  },
  getUserAttributes: (data) => ({
    email: data.email,
    role: data.role
  })
});

export type Auth = typeof auth;
```

### Part 2 – Mongoose Models for Auth

```ts
// server/src/models/authModels.ts
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;        // Lucia expects string ids
  email: string;
  hashed_password: string;
  role: 'admin' | 'doctor' | 'nurse' | 'assistant';
}
const userSchema = new Schema<IUser>({
  _id: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  hashed_password: { type: String, required: true },
  role: { type: String, default: 'assistant' }
});
export const User = model<IUser>('User', userSchema);

export interface ISession extends Document {
  _id: string;
  user_id: string;
  active_expires: number;
  idle_expires: number;
}
const sessionSchema = new Schema<ISession>({
  _id: { type: String, required: true },
  user_id: { type: String, required: true },
  active_expires: { type: Number, required: true },
  idle_expires: { type: Number, required: true }
});
export const Session = model<ISession>('Session', sessionSchema);
```

### Part 3 – Fastify Auth Plugin

Create a plugin that:
- Injects auth into app.decorate
- Adds a preHandler to validate session

```ts
// server/src/plugins/auth.ts
import fp from 'fastify-plugin';
import { auth } from '../auth/lucia';

export default fp(async (app) => {
  app.decorate('auth', auth);

  app.addHook('preHandler', async (request, reply) => {
    const sessionId = request.cookies.session ?? '';
    const { session, user } = await auth.validateSession(sessionId).catch(() => ({ session: null, user: null }));

    request.user = user ?? null;
    request.session = session ?? null;
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    auth: typeof auth;
  }
  interface FastifyRequest {
    user: { email: string; role: string } | null;
    session: any;
  }
}
```

### Part 4 – Auth Routes

```ts
// server/src/routes/auth.ts
import { FastifyPluginAsync } from 'fastify';
import { auth } from '../auth/lucia';
import { User } from '../models/authModels';
import { randomUUID } from 'crypto';
import argon2 from 'argon2';

const authRoutes: FastifyPluginAsync = async (app) => {
  // Sign up
  app.post('/signup', async (req, reply) => {
    const { email, password } = req.body as { email: string; password: string };
    const existing = await User.findOne({ email });
    if (existing) return reply.code(409).send({ error: 'Email already in use' });

    const hashed = await argon2.hash(password);
    const userId = randomUUID();
    await User.create({ _id: userId, email, hashed_password: hashed });

    const session = await auth.createSession({ userId, attributes: {} });
    auth.createSessionCookie(session).forEach((cookie) =>
      reply.setCookie(cookie.name, cookie.value, cookie.attributes)
    );

    return reply.code(201).send({ message: 'User created' });
  });

  // Login
  app.post('/login', async (req, reply) => {
    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ email });
    if (!user || !(await argon2.verify(user.hashed_password, password))) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }
    const session = await auth.createSession({ userId: user._id, attributes: {} });
    auth.createSessionCookie(session).forEach((cookie) =>
      reply.setCookie(cookie.name, cookie.value, cookie.attributes)
    );

    return reply.send({ message: 'Logged in' });
  });

  // Logout
  app.post('/logout', async (req, reply) => {
    if (req.session) {
      await auth.invalidateSession(req.session.userId, req.session.sessionId);
    }
    reply.clearCookie('session', { path: '/' });
    return reply.send({ message: 'Logged out' });
  });

  // Current user
  app.get('/me', async (req, reply) => {
    if (!req.user) return reply.code(401).send({ error: 'Not authenticated' });
    return reply.send(req.user);
  });
};

export default authRoutes;
```

### Part 5 – Protect Routes

```ts
// server/src/routes/patients.ts
app.get('/patients', { preHandler: [requireAuth()] }, async (req, reply) => {
  // ...
});

function requireAuth() {
  return async (req: any, reply: any) => {
    if (!req.user) return reply.code(401).send({ error: 'Unauthorized' });
  };
}
```

### Part 6 – Frontend Integration (TanStack Query)

#### 6.1 Auth API Client

```ts
// ui/src/lib/api/auth.ts
import { client } from './client';

export const login = (email: string, password: string) =>
  client.post('/auth/login', { email, password });

export const signup = (email: string, password: string) =>
  client.post('/auth/signup', { email, password });

export const logout = () => client.post('/auth/logout');

export const getMe = () => client.get('/auth/me');
```

#### 6.2 Auth Hooks with TanStack Query

```ts
// ui/src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, signup, logout, getMe } from '@/lib/api/auth';

export function useMe() {
  return useQuery(['me'], getMe, { retry: false });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: () => qc.invalidateQueries(['me'])
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => qc.invalidateQueries(['me'])
  });
}

export function useSignup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => signup(email, password),
    onSuccess: () => qc.invalidateQueries(['me'])
  });
}
```

#### 6.3 Protected Routes (React Router)

```tsx
// ui/src/routes.tsx
import { useMe } from '@/hooks/useAuth';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { data, isLoading } = useMe();
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <Navigate to="/login" replace />;
  return children;
}

// usage
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage/>
    </ProtectedRoute>
  }
/>
```

### Part 7 – Testing

**Backend:**
- Unit test authRoutes (signup/login/logout/me) using Supertest + Vitest/Jest

**Frontend:**
- Component tests for LoginForm and SignupForm
- Integration tests for ProtectedRoute behavior

### Part 8 – Security Checklist

- Use `secure: true` cookies in prod (HTTPS).
- Rate limit login attempts (Fastify plugin: `fastify-rate-limit`).
- Validate body payloads with Zod or Fastify JSON schema.
- Store only hashed passwords (argon2/bcrypt).
- Ensure CORS config is strict (allowed origins).
- Set proper Content Security Policy on frontend hosting.
