import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
    id,
    type,
    title,
    message,
    duration = 5000,
    onClose
}) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'error':
                return <XCircle className="w-5 h-5" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5" />;
            case 'info':
                return <Info className="w-5 h-5" />;
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    container: 'bg-green-50 border-green-200',
                    icon: 'text-green-600',
                    title: 'text-green-800',
                    message: 'text-green-700',
                    closeButton: 'text-green-500 hover:text-green-700'
                };
            case 'error':
                return {
                    container: 'bg-red-50 border-red-200',
                    icon: 'text-red-600',
                    title: 'text-red-800',
                    message: 'text-red-700',
                    closeButton: 'text-red-500 hover:text-red-700'
                };
            case 'warning':
                return {
                    container: 'bg-yellow-50 border-yellow-200',
                    icon: 'text-yellow-600',
                    title: 'text-yellow-800',
                    message: 'text-yellow-700',
                    closeButton: 'text-yellow-500 hover:text-yellow-700'
                };
            case 'info':
                return {
                    container: 'bg-blue-50 border-blue-200',
                    icon: 'text-blue-600',
                    title: 'text-blue-800',
                    message: 'text-blue-700',
                    closeButton: 'text-blue-500 hover:text-blue-700'
                };
            default:
                return {
                    container: 'bg-gray-50 border-gray-200',
                    icon: 'text-gray-600',
                    title: 'text-gray-800',
                    message: 'text-gray-700',
                    closeButton: 'text-gray-500 hover:text-gray-700'
                };
        }
    };

    const styles = getStyles();

    return (
        <div
            className={cn(
                'relative flex items-start p-4 rounded-lg border shadow-lg transition-all duration-300 ease-in-out transform',
                'animate-in slide-in-from-right-full',
                styles.container
            )}
            role="alert"
            aria-live="polite"
        >
            {/* Icon */}
            <div className={cn('flex-shrink-0', styles.icon)}>
                {getIcon()}
            </div>

            {/* Content */}
            <div className="ml-3 flex-1">
                <h4 className={cn('text-sm font-semibold', styles.title)}>
                    {title}
                </h4>
                {message && (
                    <p className={cn('mt-1 text-sm', styles.message)}>
                        {message}
                    </p>
                )}
            </div>

            {/* Close Button */}
            <button
                onClick={() => onClose(id)}
                className={cn(
                    'ml-4 flex-shrink-0 rounded-md p-1.5 transition-colors duration-200',
                    'hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    styles.closeButton
                )}
                aria-label="Cerrar notificación"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
