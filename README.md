# Clínica Médica Cuyún Gaitán - Medical Clinic Dashboard

A full-stack medical clinic management application built with React, TypeScript, Tailwind CSS, and MongoDB.

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

## Project Structure

This is a monorepo with the following structure:

```
clinica-medica-cuyun-gaitan/
├── ui/                     # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── PatientSearch.tsx
│   │   │   └── PatientDetail.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   └── Patient.tsx
│   │   └── ...
│   ├── package.json
│   └── ...
├── server/                 # Backend Node.js/Express application
│   ├── src/               # Will contain API routes and models
│   ├── package.json
│   └── ...
├── docker-compose.yml     # MongoDB setup (to be created)
└── README.md
```

## Part 1 Implementation Status ✅

### Completed Features:

1. **Monorepo Setup**
   - ✅ Created `server/` and `ui/` folders
   - ✅ Initialized server workspace with Express, TypeScript, and MongoDB dependencies
   - ✅ Moved existing React app to `ui/` folder

2. **Tailwind CSS Configuration**
   - ✅ Updated `ui/tailwind.config.js` with hospital-themed colors:
     - `hospitalBlue: '#E0F2FE'` - Light blue background
     - `hospitalWhite: '#FFFFFF'` - Clean white surfaces
     - `accentBlue: '#60A5FA'` - Interactive elements

3. **UI Component Structure**
   - ✅ **DashboardLayout**: Header, sidebar navigation, and main content area
   - ✅ **StatsCard**: Displays statistics with icons and trend indicators
   - ✅ **PatientSearch**: Debounced search with real-time results
   - ✅ **PatientDetail**: Comprehensive patient form with notes management

4. **Pages Implementation**
   - ✅ **Dashboard**: Stats overview, patient search, and recent activity
   - ✅ **Patient**: Patient detail view with create/edit functionality

5. **Responsive Design**
   - ✅ Mobile-first approach using Tailwind breakpoints (`sm:`, `md:`, `lg:`)
   - ✅ Grid layouts that adapt to screen size
   - ✅ Responsive navigation and content areas

## Design System

### Colors
- **Primary Background**: `bg-hospitalBlue` - Soft blue for main areas
- **Surface**: `bg-hospitalWhite` - Clean white for cards and forms
- **Accent**: `bg-accentBlue` - Blue for buttons and interactive elements
- **Text**: Standard gray scale for hierarchy

### Components
All components follow consistent patterns:
- Hospital-themed color scheme
- Responsive grid layouts
- Accessible form controls
- Consistent spacing and typography

## Getting Started

### Frontend (UI)
```bash
cd ui
npm install
npm run dev
```

### Backend (Server)
```bash
cd server
yarn install
# MongoDB setup completed in Part 2
```

### Database (MongoDB)
```bash
# Start MongoDB and Mongo Express
docker-compose up -d

# Test connection
cd server
node test-connection.js

# Access Mongo Express UI
# http://localhost:8081 (admin/admin123)
```

## Next Steps (Parts 3-5)

- **Part 3**: Mongoose models and TypeScript interfaces
- **Part 4**: API development and frontend integration
- **Part 5**: Testing and CI/CD setup

## Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (with Mongoose)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS with custom hospital theme
