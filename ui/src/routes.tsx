import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardPage, PatientDetailPage, NewPatientPage, AllPatientsPage } from './pages';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/tablero" replace />
    },
    {
        path: '/iniciar-sesion',
        element: <LoginForm />
    },
    {
        path: '/registro',
        element: <SignupForm />
    },
    {
        path: '/tablero',
        element: (
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/pacientes',
        element: (
            <ProtectedRoute>
                <AllPatientsPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/paciente/nuevo',
        element: (
            <ProtectedRoute>
                <NewPatientPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/paciente/:id',
        element: (
            <ProtectedRoute>
                <PatientDetailPage />
            </ProtectedRoute>
        )
    },
    // every other route goes to the dashboard
    {
        path: '*',
        element: <Navigate to="/tablero" replace />
    }
]);
