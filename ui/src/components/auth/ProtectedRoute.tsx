import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useMe } from '@/hooks/useAuth';
import { Spinner } from '@/components/atoms/Spinner';

interface ProtectedRouteProps {
    children: ReactNode;
    roles?: string[];
    fallback?: ReactNode;
}

export function ProtectedRoute({ children, roles, fallback }: ProtectedRouteProps) {
    const { data, isLoading, error } = useMe();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (error || !data?.user) {
        return <Navigate to="/iniciar-sesion" state={{ from: location }} replace />;
    }

    // If roles are specified, check if user has required role
    if (roles && roles.length > 0 && !roles.includes(data.user.role)) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
                    <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

// Convenience components for specific roles
export function AdminRoute({ children }: { children: ReactNode }) {
    return <ProtectedRoute roles={['admin']}>{children}</ProtectedRoute>;
}

export function DoctorRoute({ children }: { children: ReactNode }) {
    return <ProtectedRoute roles={['admin', 'doctor']}>{children}</ProtectedRoute>;
}

export function MedicalStaffRoute({ children }: { children: ReactNode }) {
    return <ProtectedRoute roles={['admin', 'doctor', 'nurse']}>{children}</ProtectedRoute>;
}