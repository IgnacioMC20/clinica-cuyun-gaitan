import React from 'react';
import { cn } from '@/lib/utils';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'search';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    type?: InputType;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    type = 'text',
    leftIcon,
    rightIcon,
    className,
    id,
    ...rest
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    const errorStyles = error ? 'border-red-500 focus-visible:ring-red-500' : '';
    const iconPadding = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500">
                        {leftIcon}
                    </div>
                )}

                <input
                    id={inputId}
                    type={type}
                    className={cn(
                        baseStyles,
                        errorStyles,
                        iconPadding,
                        className
                    )}
                    {...rest}
                />

                {rightIcon && (
                    <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500">
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-600" role="alert">
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p className="text-sm text-gray-500">
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default Input;
