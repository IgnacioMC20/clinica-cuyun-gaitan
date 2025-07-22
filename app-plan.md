# Project Plan: Medical Clinic Dashboard App

A simple full‑stack application using React, TypeScript, Tailwind CSS, and MongoDB (Mongoose). The UI will use light hospital‑themed colors (soft blue and white).

## Project Timeline Summary

**Total Estimated Time: 17-24 hours**

- **Part 1**: Monorepo Setup & UI Mockup (4-6 hours)
- **Part 2**: MongoDB Development Setup with Docker (1-2 hours)
- **Part 3**: Mongoose Models & TypeScript Interfaces (2-3 hours)
- **Part 4**: API & Frontend Integration (6-8 hours)
- **Part 5**: Unit & Integration Tests (4-5 hours)

*Note: Times are estimates for a developer with intermediate experience in React, TypeScript, and Node.js. Actual time may vary based on experience level and complexity of requirements.*

---
## Part 1: Monorepo Setup & UI Mockup
**Estimated Time: 4-6 hours**

We'll restructure into a single repo with two folders—`server` for backend and `ui` for frontend—then scaffold and style the UI.

### Goals
- Establish a monorepo with clear separation of frontend (`ui`) and backend (`server`)
- Define overall page structure and responsive behavior in the `ui` folder
- Establish a design system using Tailwind CSS

### Tasks

1. **Create root folder & initialize Git**
   ```bash
   mkdir clinica-medica-cuyun-gaitan
   cd clinica-medica-cuyun-gaitan
   git init
   ```

2. **Generate server and ui workspaces**

   ```bash
   # Backend
   mkdir server
   cd server
   npm init -y
   yarn add express mongoose cors dotenv
   yarn add -D typescript ts-node @types/express @types/node
   npx tsc --init
   cd ..

   # Frontend
   npx create-react-app ui --template typescript
   cd ui
   yarn add tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   cd ..
   ```

3. **Configure Tailwind in ui**

   tailwind.config.js (in ui/):

   ```js
   module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}"
     ],
     theme: {
       extend: {
         colors: {
           hospitalBlue: '#E0F2FE',
           hospitalWhite: '#FFFFFF',
           accentBlue:   '#60A5FA',
         },
       },
     },
     plugins: [],
   };
   ```

   src/index.css (in ui/):

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Define UI component structure**

   Create these folders/files under ui/src/components/:

   ```bash
   ui/src/
   └── components/
       ├── DashboardLayout.tsx
       ├── StatsCard.tsx
       ├── PatientSearch.tsx
       └── PatientDetail.tsx
   ```

   - DashboardLayout.tsx: header, sidebar, main container
   - StatsCard.tsx: card showing a label + number
   - PatientSearch.tsx: input + list of results
   - PatientDetail.tsx: form/view for patient fields

5. **Create basic pages**

   Under ui/src/pages/:

   ```bash
   ui/src/pages/
   ├── Dashboard.tsx
   └── Patient.tsx
   ```

   - Dashboard.tsx: imports DashboardLayout, fetches stats, renders StatsCard grid and PatientSearch
   - Patient.tsx: imports DashboardLayout, fetches single patient by ID, renders PatientDetail

6. **Ensure responsive design**
   - Use Tailwind breakpoints (sm, md, lg) in your components and layout classes
   - Follow mobile‑first approach: default styles for small screens, then md: and lg: overrides

----

## Part 2: MongoDB Development Setup with Docker
**Estimated Time: 1-2 hours**

### Goals
- Run MongoDB locally via Docker for development
- Connect backend (and later frontend) to local database

### Tasks
1. **Create a docker-compose.yml at project root**

   ```yaml
   version: '3.8'
   services:
     mongodb:
       image: mongo:6
       container_name: clinic-mongo
       ports:
         - '27017:27017'
       volumes:
         - mongo_data:/data/db
   volumes:
     mongo_data:
   ```

2. **Start MongoDB**

   ```bash
   docker-compose up -d
   ```

3. **Verify connection**

   Use MongoDB Compass or mongo shell:

   ```bash
   mongo --host localhost --port 27017
   ```

4. **Environment variables**

   Create .env.development at project root:

   ```bash
   MONGODB_URI=mongodb://localhost:27017/clinic-dashboard
   ```

5. **Add .env* to .gitignore**

---

## Part 3: Mongoose Models & TypeScript Interfaces
**Estimated Time: 2-3 hours**

### Goals
- Define schema and interface for Patient entity
- Ensure type safety across backend and frontend (via shared types)

### Tasks
1. **Install Mongoose in server folder**

   ```bash
   cd server
   yarn add mongoose
   yarn add -D @types/mongoose
   cd ..
   ```

2. **Create server/src/models/Patient.ts**

   ```ts
   import { Schema, model, Document } from 'mongoose';

   export interface IPatient extends Document {
     firstName:    string;
     lastName:     string;
     address:      string;
     age:          number;
     gender:       'male' | 'female' | 'child';
     maritalStatus:string;
     occupation:   string;
     phone:        string;
     vaccination:  string[];
     visitDate:    Date;
     notes:        { title: string; content: string }[];
   }

   const PatientSchema = new Schema<IPatient>({
     firstName:     { type: String, required: true },
     lastName:      { type: String, required: true },
     address:       { type: String, required: true },
     age:           { type: Number, required: true },
     gender:        { type: String, enum: ['male','female','child'], required: true },
     maritalStatus: { type: String, required: true },
     occupation:    { type: String, required: true },
     phone:         { type: String, required: true },
     vaccination:   [String],
     visitDate:     { type: Date,   required: true },
     notes: [{
       title:   String,
       content: String
     }],
   }, { timestamps: true });

   export const Patient = model<IPatient>('Patient', PatientSchema);
   ```

3. **Shared Types**

   Extract IPatient interface to a shared folder at project root for both `server` and `ui` to import

---

## Part 4: API & Frontend Integration
**Estimated Time: 6-8 hours**

### Goals
- Build REST API with Express + TypeScript
- Integrate frontend pages with backend endpoints

### Tasks
1. **Set up Express server**
   - The server/ folder already has its own package.json from Part 1
   - Dependencies already installed in Part 1
   - Create server/src/index.ts to load .env, connect to MongoDB, and start:

   ```ts
   import express from 'express';
   import mongoose from 'mongoose';
   import cors from 'cors';
   import routes from './routes';

   const app = express();
   app.use(cors(), express.json());

   mongoose.connect(process.env.MONGODB_URI!);
   app.use('/api', routes);

   app.listen(4000, () => console.log('Server running on http://localhost:4000'));
   ```

2. **Define routes in server/src/routes.ts**

   ```ts
   import { Router } from 'express';
   import { Patient } from './models/Patient';

   const router = Router();

   // Get stats
   router.get('/stats', async (_, res) => {
     const total     = await Patient.countDocuments();
     const male      = await Patient.countDocuments({ gender: 'male' });
     const female    = await Patient.countDocuments({ gender: 'female' });
     const children  = await Patient.countDocuments({ gender: 'child' });
     res.json({ total, male, female, children });
   });

   // CRUD for patients
   router.post('/patients',   async (req, res) => { /* create */ });
   router.get('/patients',    async (req, res) => { /* list */ });
   router.get('/patients/:id',async (req, res) => { /* single */ });
   router.put('/patients/:id',async (req, res) => { /* update */ });
   router.delete('/patients/:id',async (req,res)=>{ /* delete */ });

   export default router;
   ```

3. **Consume API in React (ui folder)**
   - Install axios or use fetch in the ui folder
   - Create hooks: useStats, usePatients, usePatient(id) in ui/src/hooks/
   - Example in ui/src/pages/Dashboard.tsx:

   ```tsx
   const { data: stats } = useStats();
   return (
     <div className="grid gap-4 sm:grid-cols-4">
       <StatsCard label="Total" value={stats.total} />
       {/* ... */}
     </div>
   );
   ```

4. **Patient Search & Detail**
   - PatientSearch: controlled input + debounced API call
   - On select, navigate to /patient/[id] and render PatientDetail

---

## Part 5: Unit & Integration Tests
**Estimated Time: 4-5 hours**

### Goals
- Ensure reliability of models, API, and React components

### Tasks
1. **Backend tests (Jest + Supertest)**
   - In server folder: yarn add -D jest ts-jest @types/jest supertest
   - Write tests for:
     - Model validation (invalid data rejected)
     - API endpoints: stats, CRUD operations
   - Example in server/src/__tests__/:

   ```ts
   import request from 'supertest';
   import app from '../src/index';

   describe('GET /api/stats', () => {
     it('returns counts', async () => {
       const res = await request(app).get('/api/stats');
       expect(res.status).toBe(200);
       expect(res.body).toHaveProperty('total');
     });
   });
   ```

2. **Frontend tests (React Testing Library)**
   - In ui folder: yarn add -D @testing-library/react @testing-library/jest-dom
   - Test components in ui/src/__tests__/:
     - StatsCard renders correct label/value
     - PatientSearch debounces and displays results
     - PatientDetail form validation

3. **CI Integration**

   Add GitHub Actions workflow:

   ```yaml
   name: CI
   on: [push, pull_request]
   jobs:
     build-and-test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with: 
             node-version: '18'
         - run: |
             cd server && yarn install
             cd ../ui && yarn install
         - run: |
             cd server && yarn test --coverage
             cd ../ui && yarn test --coverage
   ```

---

## Deliverables:

- Monorepo with `server/` and `ui/` folders
- README with setup & usage for both frontend and backend
- Docker-compose for MongoDB at project root
- Mongoose models & shared types
- Express API with full CRUD & stats in `server/`
- React frontend with dashboard & patient pages in `ui/`
- Unit & integration tests with CI setup for both folders