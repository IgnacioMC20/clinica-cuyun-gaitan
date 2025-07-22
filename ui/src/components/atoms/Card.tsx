import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
    children,
    header,
    footer,
    padding = 'md',
    className,
    ...rest
}) => {
    const baseStyles = 'rounded-lg border bg-gray-50 text-gray-900 shadow-sm';

    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div className={cn(baseStyles, className)} {...rest}>
            {header && (
                <div className={cn('border-b pb-4 mb-4', padding !== 'none' && 'px-6 pt-6')}>
                    {header}
                </div>
            )}

            <div className={cn(paddingStyles[padding], header && 'pt-0', footer && 'pb-0')}>
                {children}
            </div>

            {footer && (
                <div className={cn('border-t pt-4 mt-4', padding !== 'none' && 'px-6 pb-6')}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
