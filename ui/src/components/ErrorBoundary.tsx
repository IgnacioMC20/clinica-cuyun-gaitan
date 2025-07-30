import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './atoms/Button';
import { Card } from './atoms/Card';
import { Typography } from './atoms/Typography';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the error to console for debugging
        console.error('Error Boundary caught an error:', error, errorInfo);

        // In production, you might want to log this to an error reporting service
        // Example: logErrorToService(error, errorInfo);
    }

    handleReload = () => {
        // Reload the page to reset the application state
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full p-8 text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <Typography variant="h2" className="text-gray-900 mb-2">
                                Algo salió mal
                            </Typography>
                            <Typography variant="body" className="text-gray-600 mb-6">
                                Ha ocurrido un error inesperado en la aplicación. Por favor, recarga la página para continuar.
                            </Typography>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={this.handleReload}
                                className="w-full"
                                variant="primary"
                            >
                                Recargar Página
                            </Button>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="text-left mt-4">
                                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                        Detalles del error (desarrollo)
                                    </summary>
                                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                                        {this.state.error.stack}
                                    </pre>
                                </details>
                            )}
                        </div>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;