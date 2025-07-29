# UI Folder Structure - Clínica Médica Cuyún Gaitán

This document provides a comprehensive overview of the frontend application structure, highlighting important files, components, and architectural decisions.

## 📁 Project Overview

The UI folder contains a modern React application built with TypeScript, Vite, and Tailwind CSS, specifically designed for a medical clinic dashboard in Guatemala.

## 🏗️ Folder Structure

```
ui/
├── public/                          # Static assets
│   ├── favicon.ico                  # Browser favicon
│   ├── logo.svg                     # Application logo
│   ├── pwa-*.png                    # PWA icons (various sizes)
│   ├── apple-touch-icon-180x180.png # iOS home screen icon
│   ├── maskable-icon-512x512.png    # Maskable PWA icon
│   └── _redirects                   # Netlify/Vercel redirects
├── src/                             # Source code
│   ├── components/                  # React components
│   │   ├── ui/                      # shadcn/ui base components
│   │   ├── custom-ui/               # Custom UI components
│   │   ├── partials/                # Layout partials
│   │   ├── __tests__/               # Component tests
│   │   ├── DashboardLayout.tsx      # 🔥 Main layout component
│   │   ├── StatsCard.tsx            # 🔥 Statistics display card
│   │   ├── PatientSearch.tsx        # 🔥 Patient search functionality
│   │   ├── PatientDetail.tsx        # 🔥 Patient form/details
│   │   ├── Seo.tsx                  # SEO meta tags
│   │   ├── mode-toggle.tsx          # Dark/light mode toggle
│   │   └── theme-provider.tsx       # Theme context provider
│   ├── pages/                       # Page components
│   │   ├── Dashboard.tsx            # 🔥 Main dashboard page
│   │   ├── patient.tsx              # 🔥 Patient management page
│   │   ├── home.tsx                 # Landing page
│   │   ├── Layout.tsx               # Page layout wrapper
│   │   ├── error.tsx                # Error page
│   │   └── not-found.tsx            # 404 page
│   ├── hooks/                       # Custom React hooks
│   │   ├── usePatients.ts           # 🔥 Patient data management
│   │   ├── useStats.ts              # 🔥 Statistics data fetching
│   │   └── use-theme.tsx            # Theme management hook
│   ├── lib/                         # Utility libraries
│   │   ├── api/                     # API layer
│   │   │   ├── client.ts            # 🔥 HTTP client configuration
│   │   │   ├── patients.ts          # 🔥 Patient API functions
│   │   │   ├── services/            # API services
│   │   │   └── utils/               # API utilities
│   │   ├── store/                   # State management
│   │   │   ├── index.ts             # Store configuration
│   │   │   ├── store.ts             # Redux store setup
│   │   │   ├── slices/              # Redux slices
│   │   │   ├── middleware/          # Custom middleware
│   │   │   └── thunks/              # Async actions
│   │   └── utils.ts                 # 🔥 Utility functions
│   ├── test/                        # Testing utilities
│   │   └── setup.ts                 # 🔥 Test environment setup
│   ├── assets/                      # Static assets
│   │   └── react.svg                # React logo
│   ├── App.tsx                      # 🔥 Main App component
│   ├── main.tsx                     # 🔥 Application entry point
│   ├── routes.tsx                   # 🔥 Routing configuration
│   ├── index.css                    # 🔥 Global styles & Tailwind
│   └── vite-env.d.ts                # Vite type definitions
├── components.json                  # 🔥 shadcn/ui configuration
├── tailwind.config.js               # 🔥 Tailwind CSS configuration
├── vite.config.ts                   # 🔥 Vite build configuration
├── vitest.config.ts                 # 🔥 Testing configuration
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.node.json               # Node.js TypeScript config
├── postcss.config.js                # PostCSS configuration
├── package.json                     # 🔥 Dependencies & scripts
└── index.html                       # HTML entry point
```

## 🔥 Key Components & Files

### Core Application Files

#### [`src/main.tsx`](ui/src/main.tsx)
**Application Entry Point**
- Renders the React application
- Sets up React Router
- Configures theme provider
- Initializes Redux store

#### [`src/App.tsx`](ui/src/App.tsx)
**Main Application Component**
- Root component wrapper
- Global providers setup
- Error boundary implementation
- Theme and routing integration

#### [`src/routes.tsx`](ui/src/routes.tsx)
**Routing Configuration**
- React Router setup
- Route definitions for all pages
- Protected route handling
- Dynamic imports for code splitting

### Layout Components

#### [`src/components/DashboardLayout.tsx`](ui/src/components/DashboardLayout.tsx)
**🔥 Main Layout Component**
```typescript
// Key features:
- Responsive sidebar navigation
- Header with user info and actions
- Main content area with proper spacing
- Mobile-first responsive design
- Hospital-themed styling
```

**Features:**
- **Responsive Design**: Adapts to mobile, tablet, and desktop
- **Navigation**: Sidebar with medical clinic sections
- **Header**: Logo, user info, and action buttons
- **Content Area**: Proper spacing and scrolling
- **Accessibility**: ARIA labels and keyboard navigation

### Medical Components

#### [`src/components/StatsCard.tsx`](ui/src/components/StatsCard.tsx)
**🔥 Statistics Display Card**
```typescript
interface StatsCardProps {
  label: string;
  value: number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
```

**Features:**
- **Visual Design**: Hospital-themed card with icons
- **Trend Indicators**: Positive/negative change display
- **Responsive**: Adapts to different screen sizes
- **Accessibility**: Screen reader friendly

#### [`src/components/PatientSearch.tsx`](ui/src/components/PatientSearch.tsx)
**🔥 Patient Search Functionality**
```typescript
interface PatientSearchProps {
  onPatientSelect?: (patient: PatientResponse) => void;
  className?: string;
}
```

**Features:**
- **Debounced Search**: 500ms delay for performance
- **Real-time Results**: Live search as you type
- **Patient Cards**: Rich display with patient info
- **Gender Badges**: Visual gender identification
- **Loading States**: Smooth user experience
- **Error Handling**: Graceful error display

#### [`src/components/PatientDetail.tsx`](ui/src/components/PatientDetail.tsx)
**🔥 Patient Form & Details**
```typescript
interface PatientDetailProps {
  patient?: PatientResponse;
  mode: 'view' | 'edit' | 'create';
  onSave?: (patient: PatientResponse) => void;
  onCancel?: () => void;
}
```

**Features:**
- **Multi-mode**: View, edit, and create modes
- **Form Validation**: Comprehensive field validation
- **Notes Management**: Add and manage patient notes
- **Vaccination Tracking**: Multiple vaccination records
- **Spanish Interface**: Guatemala-specific terminology

### Page Components

#### [`src/pages/Dashboard.tsx`](ui/src/pages/Dashboard.tsx)
**🔥 Main Dashboard Page**
```typescript
// Key sections:
- Statistics overview (total patients, demographics)
- Patient search interface
- Recent activity feed
- Quick actions panel
```

**Features:**
- **Statistics Grid**: Real-time patient statistics
- **Search Integration**: Embedded patient search
- **Responsive Layout**: Mobile-optimized grid system
- **Loading States**: Skeleton loading for better UX

#### [`src/pages/patient.tsx`](ui/src/pages/patient.tsx)
**🔥 Patient Management Page**
```typescript
// URL patterns:
- /patient/new - Create new patient
- /patient/:id - View/edit existing patient
```

**Features:**
- **Dynamic Routing**: URL-based patient loading
- **CRUD Operations**: Create, read, update, delete
- **Form Validation**: Real-time validation feedback
- **Navigation**: Breadcrumb and back navigation

### Data Management

#### [`src/hooks/usePatients.ts`](ui/src/hooks/usePatients.ts)
**🔥 Patient Data Management Hook**
```typescript
export function usePatients() {
  // Returns: data, loading, error, fetchPatients
}

export function usePatient(id: string) {
  // Returns: patient, loading, error, refetch
}

export function usePatientMutations() {
  // Returns: createPatient, updatePatient, deletePatient
}
```

**Features:**
- **Data Fetching**: Automatic patient data loading
- **Caching**: Efficient data caching and updates
- **Error Handling**: Comprehensive error management
- **Loading States**: Loading indicators for all operations

#### [`src/hooks/useStats.ts`](ui/src/hooks/useStats.ts)
**🔥 Statistics Data Hook**
```typescript
export function useStats() {
  return {
    data: PatientStats | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
  };
}
```

### API Layer

#### [`src/lib/api/client.ts`](ui/src/lib/api/client.ts)
**🔥 HTTP Client Configuration**
```typescript
// Features:
- Axios configuration with interceptors
- Request/response transformation
- Error handling and retry logic
- Base URL and timeout configuration
```

#### [`src/lib/api/patients.ts`](ui/src/lib/api/patients.ts)
**🔥 Patient API Functions**
```typescript
// Available functions:
- getPatients(params?: PatientSearchParams)
- getPatient(id: string)
- createPatient(data: CreatePatientRequest)
- updatePatient(id: string, data: UpdatePatientRequest)
- deletePatient(id: string)
- addPatientNote(id: string, note: PatientNote)
- searchPatientByPhone(phone: string)
```

### Styling & Configuration

#### [`tailwind.config.js`](ui/tailwind.config.js)
**🔥 Tailwind CSS Configuration**
```javascript
// Hospital theme colors:
colors: {
  hospitalBlue: '#E0F2FE',    // Light blue backgrounds
  hospitalWhite: '#FFFFFF',   // Clean white surfaces
  accentBlue: '#60A5FA',      // Interactive elements
}
```

#### [`src/index.css`](ui/src/index.css)
**🔥 Global Styles**
```css
/* Includes: */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom hospital-themed styles */
/* Spanish typography optimizations */
/* Responsive design utilities */
```

### Testing

#### [`src/test/setup.ts`](ui/src/test/setup.ts)
**🔥 Test Environment Setup**
- Jest DOM matchers
- Mock implementations for browser APIs
- Test utilities and helpers
- Global test configuration

#### [`src/components/__tests__/`](ui/src/components/__tests__/)
**Component Tests**
- **StatsCard.test.tsx**: Statistics card component tests
- **PatientSearch.test.tsx**: Patient search functionality tests
- Comprehensive test coverage for UI components
- Mock implementations for hooks and API calls

## 🎨 Design System

### shadcn/ui Components

The application uses shadcn/ui as the base component library, providing:

#### [`src/components/ui/`](ui/src/components/ui/)
**Base UI Components**
- **button.tsx**: Customizable button variants
- **card.tsx**: Container components for content
- **input.tsx**: Form input components
- **dialog.tsx**: Modal and dialog components
- **badge.tsx**: Status and category indicators
- **table.tsx**: Data display tables
- **form.tsx**: Form validation and handling
- **toast.tsx**: Notification system
- **And 30+ more components**

#### [`components.json`](ui/components.json)
**shadcn/ui Configuration**
```json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Custom UI Components

#### [`src/components/custom-ui/`](ui/src/components/custom-ui/)
**Custom Components**
- **particles.tsx**: Animated background particles
- **search.tsx**: Enhanced search components
- **text.tsx**: Typography components with hospital theming

### Layout Partials

#### [`src/components/partials/`](ui/src/components/partials/)
**Layout Components**
- **navbar.tsx**: Top navigation bar
- **side-nav.tsx**: Sidebar navigation
- **footer.tsx**: Application footer

## 🔧 Configuration Files

### Build & Development

#### [`vite.config.ts`](ui/vite.config.ts)
**Vite Configuration**
```typescript
// Key features:
- React plugin configuration
- Path aliases (@/ for src/)
- PWA plugin setup
- Build optimization
- Development server settings
```

#### [`vitest.config.ts`](ui/vitest.config.ts)
**Testing Configuration**
```typescript
// Test setup:
- Vitest configuration
- jsdom environment
- Test file patterns
- Coverage settings
- Setup files
```

#### [`package.json`](ui/package.json)
**Dependencies & Scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext ts,tsx"
  }
}
```

### TypeScript Configuration

#### [`tsconfig.json`](ui/tsconfig.json)
**TypeScript Configuration**
- Strict type checking
- Path mapping for imports
- React JSX support
- Modern ES features

## 🌐 State Management

### Redux Store

#### [`src/lib/store/`](ui/src/lib/store/)
**State Management Structure**
```
store/
├── index.ts              # Store exports
├── store.ts              # Redux store configuration
├── slices/               # Redux Toolkit slices
│   ├── preferencesSlice.ts
│   ├── uiSlice.ts
│   └── userPreferencesSlice.ts
├── middleware/           # Custom middleware
└── thunks/              # Async actions
```

**Features:**
- **Redux Toolkit**: Modern Redux with less boilerplate
- **Persistence**: State persistence with redux-persist
- **Type Safety**: Full TypeScript integration
- **Middleware**: Custom middleware for API calls

## 🔍 Key Architectural Decisions

### 1. Component Architecture
- **Atomic Design**: Components organized by complexity
- **Composition**: Reusable components with props
- **Separation of Concerns**: Logic separated from presentation

### 2. Data Flow
- **Custom Hooks**: Encapsulated data fetching logic
- **API Layer**: Centralized HTTP client with error handling
- **State Management**: Redux for global state, local state for components
- **Type Safety**: Shared types between frontend and backend

### 3. Styling Strategy
- **Tailwind CSS**: Utility-first CSS framework
- **Hospital Theme**: Custom color palette for medical context
- **Component Variants**: shadcn/ui component system
- **Responsive Design**: Mobile-first approach

### 4. Performance Optimizations
- **Code Splitting**: Dynamic imports for routes
- **Lazy Loading**: Components loaded on demand
- **Debounced Search**: Optimized search performance
- **Caching**: API response caching with React Query patterns

## 🚀 Getting Started

### Development Setup
```bash
# Navigate to UI folder
cd ui

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Key Development Commands
```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 📱 Responsive Design

### Breakpoints
```css
/* Tailwind CSS breakpoints used throughout */
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Mobile-First Approach
- Default styles target mobile devices
- Progressive enhancement for larger screens
- Touch-friendly interface elements
- Optimized navigation for small screens

## 🎯 Key Features

### Medical Clinic Specific
- **Patient Management**: Complete CRUD operations
- **Search & Filter**: Advanced patient search capabilities
- **Statistics Dashboard**: Real-time clinic metrics
- **Notes System**: Medical notes and history tracking
- **Vaccination Records**: Comprehensive vaccination tracking

### Technical Features
- **PWA Ready**: Progressive Web App capabilities
- **Offline Support**: Service worker implementation
- **Type Safety**: Full TypeScript coverage
- **Testing**: Comprehensive test suite
- **Accessibility**: WCAG compliant components

## 🔒 Security Considerations

### Data Protection
- **Input Validation**: Client-side validation for all forms
- **XSS Prevention**: Sanitized user inputs
- **CSRF Protection**: Token-based request validation
- **Secure Headers**: Content Security Policy implementation

### Privacy
- **Patient Data**: Secure handling of medical information
- **Local Storage**: Minimal sensitive data storage
- **Session Management**: Secure authentication flows

## 📊 Performance Metrics

### Bundle Size Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Route-based splitting
- **Asset Optimization**: Image and font optimization
- **Lazy Loading**: Component-level lazy loading

### Runtime Performance
- **Virtual Scrolling**: For large patient lists
- **Debounced Search**: Optimized search performance
- **Memoization**: React.memo for expensive components
- **Efficient Re-renders**: Optimized state updates

## 🛠️ Development Guidelines

### Component Development
1. **Single Responsibility**: Each component has one clear purpose
2. **Props Interface**: Well-defined TypeScript interfaces
3. **Error Boundaries**: Graceful error handling
4. **Accessibility**: ARIA labels and keyboard navigation

### Code Organization
1. **File Naming**: PascalCase for components, camelCase for utilities
2. **Import Order**: External libraries, internal modules, relative imports
3. **Type Definitions**: Co-located with components when possible
4. **Testing**: Test files adjacent to source files

### Best Practices
1. **Performance**: Use React.memo and useMemo appropriately
2. **State Management**: Local state first, global state when needed
3. **Error Handling**: Comprehensive error boundaries and fallbacks
4. **Documentation**: JSDoc comments for complex functions

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vite Guide](https://vitejs.dev/guide/)

### Medical Context
- **Spanish Language**: All UI text in Spanish for Guatemala
- **Medical Terminology**: Appropriate medical terms and workflows
- **Cultural Considerations**: Guatemala-specific healthcare practices

---

**Last Updated**: January 22, 2025
**Version**: 1.0.0
**Maintainer**: Medical Clinic Development Team
