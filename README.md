# Clínica Médica Cuyún Gaitán - Medical Clinic Dashboard

A modern, full-stack medical clinic management application built with React, TypeScript, Tailwind CSS, Fastify, and MongoDB following atomic design principles.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- npm

### One-Command Setup

**Development Mode (default, with hot reload):**
```bash
./init.sh
```

**Production Mode:**
```bash
./init.sh --prod
```

This script will:
- ✅ Check system requirements
- ✅ Install all dependencies (frontend & backend)
- ✅ Start MongoDB with Docker
- ✅ Start the backend API server (ts-node in dev mode, or compiled JS in production)
- ✅ Start the frontend development server
- ✅ Create a stop script for easy cleanup

### Manual Setup (Alternative)

If you prefer to set up manually:

1. **Start MongoDB**
   ```bash
   docker-compose up -d
   ```

2. **Install and start backend**
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Install and start frontend**
   ```bash
   cd ui
   npm install
   npm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **MongoDB**: mongodb://localhost:27017
- **Mongo Express**: http://localhost:8081

### Stop the Application
```bash
./stop.sh
```

## 🏗️ Project Architecture

This is a modern monorepo following **atomic design principles** with the following structure:

```
clinica-medica-cuyun-gaitan/
├── ui/                          # Frontend React application
│   ├── src/
│   │   ├── components/          # Atomic design components
│   │   │   ├── atoms/           # Basic building blocks (Button, Input, Badge, etc.)
│   │   │   ├── molecules/       # Simple combinations (FormField, PatientCard, etc.)
│   │   │   ├── organisms/       # Complex sections (DashboardPanel, PatientForm, etc.)
│   │   │   ├── partials/        # Layout components (navbar, footer, side-nav)
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── pages/               # Page components
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── AllPatientsPage.tsx
│   │   │   ├── PatientDetailPage.tsx
│   │   │   └── NewPatientPage.tsx
│   │   ├── hooks/               # TanStack Query hooks
│   │   ├── lib/                 # API clients, utilities, store
│   │   ├── styles/              # Medical theme CSS
│   │   └── test/                # Test setup and utilities
├── server/                      # Backend Fastify application
│   ├── src/
│   │   ├── models/              # Mongoose models
│   │   ├── routes/              # API routes
│   │   ├── scripts/             # Database seeding scripts
│   │   └── __tests__/           # Backend tests
├── shared/                      # Shared TypeScript types
│   └── types/                   # Patient and API types
├── docker-compose.yml           # MongoDB and Mongo Express setup
└── README.md
```

## ✨ Features Implemented

### 🎨 Modern UI/UX Design
- **Atomic Design System**: Scalable component architecture with atoms, molecules, and organisms
- **Medical Theme**: Professional color palette and styling appropriate for healthcare environments
- **Responsive Design**: Optimized for tablets, laptops, and desktop workstations
- **Accessibility**: ARIA labels, high contrast support, keyboard navigation
- **Dark/Light Mode**: Theme switching with system preference detection

### 📊 Dashboard & Analytics
- **Statistics Overview**: Patient count, recent visits, and key metrics
- **Quick Actions**: Fast access to common tasks (new patient, search, etc.)
- **Recent Activity**: Latest patient interactions and updates
- **Patient Search**: Real-time search with debounced input

### 👥 Patient Management
- **Complete CRUD Operations**: Create, read, update, and delete patients
- **Advanced Search & Filtering**: Search by name, phone, address with multiple filters
- **Patient Cards**: Compact and detailed views with avatars and key information
- **Form Validation**: Comprehensive validation with error handling
- **Notes System**: Medical notes with timestamps and editing capabilities

### 🔧 Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **TanStack Query**: Modern data fetching with caching and optimistic updates
- **Fastify Backend**: High-performance API server with structured logging
- **MongoDB Integration**: Robust data persistence with Mongoose ODM
- **Testing Suite**: Unit tests with Jest (backend) and Vitest (frontend)
- **State Management**: Redux Toolkit for complex state scenarios

## 🎯 Pages Overview

### Dashboard (`/`)
- Main overview with statistics and quick patient access
- Side-by-side layout with dashboard panel and patient selector
- Quick actions for common workflows

### All Patients (`/patients`)
- Comprehensive patient listing with advanced filtering
- Search by name, phone, address
- Filter by gender, age range
- Sort by multiple criteria
- Responsive grid layout

### Patient Detail (`/patient/:id`)
- Complete patient information view
- Edit mode with form validation
- Medical notes management
- Delete confirmation with safety measures

### New Patient (`/patient/new`)
- Guided patient creation form
- Helpful instructions and validation
- Automatic navigation to created patient

## 🚀 Fastify Migration

The backend has been migrated from Express to Fastify for improved performance:

### Migration Benefits:
- **Performance**: Up to 2x faster than Express
- **Built-in Logging**: Structured JSON logging with request/response timing
- **Schema Validation**: Built-in JSON schema validation capabilities
- **TypeScript Support**: Better TypeScript integration out of the box
- **Plugin System**: Modular architecture with encapsulated plugins

### API Endpoints:
- `GET /api/stats` - Patient statistics
- `GET /api/patients` - List patients with search/pagination
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `POST /api/patients/:id/notes` - Add patient note

## 🧪 Testing

### Frontend Testing
```bash
cd ui
npm run test          # Run tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Run with coverage
```

### Backend Testing
```bash
cd server
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 🎨 Design System

### Medical Color Palette
- **Primary Blue**: Professional and trustworthy (`#2563eb`)
- **Success Green**: Health and positive outcomes (`#059669`)
- **Warning Orange**: Caution and attention (`#ea580c`)
- **Error Red**: Alerts and critical information (`#dc2626`)
- **Neutral Gray**: Text and subtle elements (`#6b7280`)

### Component Variants
- **Buttons**: Primary, secondary, outline, ghost, destructive
- **Cards**: Default, hover states, medical styling
- **Forms**: Validation states, accessibility features
- **Badges**: Status indicators with semantic colors

### Typography
- **Font Family**: Inter (professional and readable)
- **Scale**: h1/h2/h3/h4, body variants, labels, captions
- **Medical Hierarchy**: Optimized for healthcare information

## 🔧 Development Scripts

### Frontend (UI)
```bash
npm run dev           # Development server
npm run build         # Production build
npm run preview       # Preview production build
npm run lint          # ESLint
npm run test          # Run tests
```

### Backend (Server)
```bash
npm run dev           # Development with ts-node
npm run build         # TypeScript compilation
npm run start         # Production server
npm run seed          # Seed database with sample data
```

## 📦 Technologies Used

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling with medical theme
- **TanStack Query** - Data fetching and state management
- **React Router** - Client-side routing
- **Redux Toolkit** - Complex state management
- **Vite** - Fast build tool and development server
- **Vitest** - Unit testing framework

### Backend
- **Node.js** - JavaScript runtime
- **Fastify** - High-performance web framework
- **TypeScript** - Type safety for backend code
- **MongoDB** - Document database
- **Mongoose** - MongoDB object modeling
- **Jest** - Testing framework

### DevOps & Tools
- **Docker** - Containerization for MongoDB
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **shadcn/ui** - High-quality UI components

## 🚀 Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment with:
- Automatic builds from Git
- Environment variable support
- SPA routing configuration

### Backend
The backend can be deployed to any Node.js hosting platform:
- Railway, Render, or DigitalOcean
- Environment variables for MongoDB connection
- Production build optimization

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏥 About Clínica Médica Cuyún Gaitán

A modern medical clinic management system designed to streamline patient care and administrative workflows. Built with healthcare professionals in mind, focusing on usability, reliability, and data security.

---

**Built with ❤️ for healthcare professionals**
