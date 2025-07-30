import React from 'react';
import { useRouteError, useNavigate, isRouteErrorResponse } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';

const RouteErrorPage: React.FC = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    const getErrorInfo = () => {
        if (isRouteErrorResponse(error)) {
            return {
                status: error.status,
                statusText: error.statusText,
                message: getStatusMessage(error.status)
            };
        }

        if (error instanceof Error) {
            return {
                status: 500,
                statusText: 'Error Interno',
                message: 'Ha ocurrido un error inesperado en la aplicación.'
            };
        }

        return {
            status: 500,
            statusText: 'Error Desconocido',
            message: 'Ha ocurrido un error inesperado.'
        };
    };

    const getStatusMessage = (status: number): string => {
        switch (status) {
            case 404:
                return 'La página que buscas no existe o ha sido movida.';
            case 403:
                return 'No tienes permisos para acceder a esta página.';
            case 401:
                return 'Necesitas iniciar sesión para acceder a esta página.';
            case 500:
                return 'Error interno del servidor. Por favor, intenta más tarde.';
            default:
                return 'Ha ocurrido un error inesperado.';
        }
    };

    const getErrorIcon = (status: number) => {
        switch (status) {
            case 404:
                return (
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            case 403:
                return (
                    <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
        }
    };

    const { status, statusText, message } = getErrorInfo();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-lg w-full p-8 text-center">
                <div className="mb-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-100">
                        {getErrorIcon(status)}
                    </div>

                    <Typography variant="h1" className="text-gray-900 mb-2">
                        {status}
                    </Typography>

                    <Typography variant="h3" className="text-gray-700 mb-4">
                        {statusText}
                    </Typography>

                    <Typography variant="body" className="text-gray-600 mb-6">
                        {message}
                    </Typography>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={() => navigate(-1)}
                        className="w-full"
                        variant="primary"
                    >
                        Volver Atrás
                    </Button>

                    <Button
                        onClick={() => navigate('/tablero')}
                        className="w-full"
                        variant="outline"
                    >
                        Ir al Tablero
                    </Button>

                    {process.env.NODE_ENV === 'development' && error instanceof Error && (
                        <details className="text-left mt-6">
                            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                Detalles del error (desarrollo)
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40 text-left">
                                {error.stack}
                            </pre>
                        </details>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default RouteErrorPage;