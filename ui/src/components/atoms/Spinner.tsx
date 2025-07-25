import React from 'react';
import { cn } from '@/lib/utils';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: SpinnerSize;
    color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    color = 'text-blue-600',
    className,
    ...rest
}) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
    };

    return (
        <div
            className={cn('inline-block animate-spin', className)}
            role="status"
            aria-label="Loading"
            {...rest}
        >
            <svg
                className={cn(sizes[size], color)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;