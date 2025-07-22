import React from 'react';
import { Toast, type ToastType } from '../atoms/Toast';

export interface ToastData {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContainerProps {
    toasts: ToastData[];
    onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
    toasts,
    onRemoveToast
}) => {
    if (toasts.length === 0) {
        return null;
    }

    return (
        <div
            className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full"
            aria-live="polite"
            aria-label="Notificaciones"
        >
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    duration={toast.duration}
                    onClose={onRemoveToast}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
