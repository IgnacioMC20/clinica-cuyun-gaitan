import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardPage, PatientDetailPage, NewPatientPage, AllPatientsPage } from './pages';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import RouteErrorPage from './components/errors/RouteErrorPage';
import GeneralErrorPage from './components/errors/GeneralErrorPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/tablero" replace />,
        errorElement: <RouteErrorPage />
    },
    {
        path: '/iniciar-sesion',
        element: <LoginForm />,
        errorElement: <GeneralErrorPage
            title="Error de Autenticación"
            message="Ha ocurrido un error al cargar la página de inicio de sesión."
        />
    },
    {
        path: '/registro',
        element: <SignupForm />,
        errorElement: <GeneralErrorPage
            title="Error de Registro"
            message="Ha ocurrido un error al cargar la página de registro."
        />
    },
    {
        path: '/tablero',
        element: (
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
        ),
        errorElement: <GeneralErrorPage
            title="Error en el Tablero"
            message="Ha ocurrido un error al cargar el tablero principal."
        />
    },
    {
        path: '/pacientes',
        element: (
            <ProtectedRoute>
                <AllPatientsPage />
            </ProtectedRoute>
        ),
        errorElement: <GeneralErrorPage
            title="Error en Lista de Pacientes"
            message="Ha ocurrido un error al cargar la lista de pacientes."
        />
    },
    {
        path: '/paciente/nuevo',
        element: (
            <ProtectedRoute>
                <NewPatientPage />
            </ProtectedRoute>
        ),
        errorElement: <GeneralErrorPage
            title="Error al Crear Paciente"
            message="Ha ocurrido un error al cargar el formulario de nuevo paciente."
        />
    },
    {
        path: '/paciente/:id',
        element: (
            <ProtectedRoute>
                <PatientDetailPage />
            </ProtectedRoute>
        ),
        errorElement: <GeneralErrorPage
            title="Error en Detalle de Paciente"
            message="Ha ocurrido un error al cargar los detalles del paciente."
        />
    },
    // every other route goes to the dashboard
    {
        path: '*',
        element: <Navigate to="/tablero" replace />,
        errorElement: <RouteErrorPage />
    }
]);
