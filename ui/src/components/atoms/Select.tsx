import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: SelectOption[];
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    helperText,
    options,
    placeholder = 'Seleccionar...',
    className,
    id,
    ...rest
}) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    const errorStyles = error ? 'border-red-500 focus-visible:ring-red-500' : '';

    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={selectId}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    id={selectId}
                    className={cn(
                        baseStyles,
                        errorStyles,
                        'appearance-none bg-no-repeat bg-right bg-[length:16px_16px] pr-8',
                        className
                    )}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center'
                    }}
                    {...rest}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
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

export default Select;
