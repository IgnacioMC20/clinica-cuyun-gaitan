import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'info' | 'success' | 'warning' | 'error' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant;
    children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    children,
    className,
    ...rest
}) => {
    const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

    const variants = {
        default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        success: 'bg-green-100 text-green-800 hover:bg-green-200',
        warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        error: 'bg-red-100 text-red-800 hover:bg-red-200',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    };

    return (
        <div
            className={cn(
                baseStyles,
                variants[variant],
                className
            )}
            {...rest}
        >
            {children}
        </div>
    );
};

export default Badge;