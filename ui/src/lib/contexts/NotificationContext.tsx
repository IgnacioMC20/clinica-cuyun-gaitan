import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer, type ToastData } from '../../components/organisms/ToastContainer';
import type { ToastType } from '../../components/atoms/Toast';

interface NotificationContextType {
    showNotification: (type: ToastType, title: string, message?: string, duration?: number) => void;
    showSuccess: (title: string, message?: string, duration?: number) => void;
    showError: (title: string, message?: string, duration?: number) => void;
    showWarning: (title: string, message?: string, duration?: number) => void;
    showInfo: (title: string, message?: string, duration?: number) => void;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const generateId = useCallback(() => {
        return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    const showNotification = useCallback((
        type: ToastType,
        title: string,
        message?: string,
        duration: number = 5000
    ) => {
        const id = generateId();
        const newToast: ToastData = {
            id,
            type,
            title,
            message,
            duration
        };

        setToasts(prev => [...prev, newToast]);
    }, [generateId]);

    const showSuccess = useCallback((title: string, message?: string, duration?: number) => {
        showNotification('success', title, message, duration);
    }, [showNotification]);

    const showError = useCallback((title: string, message?: string, duration?: number) => {
        showNotification('error', title, message, duration);
    }, [showNotification]);

    const showWarning = useCallback((title: string, message?: string, duration?: number) => {
        showNotification('warning', title, message, duration);
    }, [showNotification]);

    const showInfo = useCallback((title: string, message?: string, duration?: number) => {
        showNotification('info', title, message, duration);
    }, [showNotification]);

    const removeNotification = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setToasts([]);
    }, []);

    const value: NotificationContextType = {
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeNotification,
        clearAllNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <ToastContainer
                toasts={toasts}
                onRemoveToast={removeNotification}
            />
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export default NotificationContext;
