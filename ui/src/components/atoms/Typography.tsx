import React from 'react';
import { cn } from '@/lib/utils';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodyLarge' | 'bodySmall' | 'label' | 'caption' | 'overline';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    variant: TypographyVariant;
    children: React.ReactNode;
    as?: keyof JSX.IntrinsicElements;
}

export const Typography: React.FC<TypographyProps> = ({
    variant,
    children,
    as,
    className,
    ...rest
}) => {
    const variants = {
        h1: {
            element: 'h1' as const,
            styles: 'text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl'
        },
        h2: {
            element: 'h2' as const,
            styles: 'text-3xl font-semibold tracking-tight text-gray-900'
        },
        h3: {
            element: 'h3' as const,
            styles: 'text-2xl font-semibold tracking-tight text-gray-900'
        },
        h4: {
            element: 'h4' as const,
            styles: 'text-xl font-semibold tracking-tight text-gray-900'
        },
        body: {
            element: 'p' as const,
            styles: 'text-base leading-7 text-gray-700'
        },
        bodyLarge: {
            element: 'p' as const,
            styles: 'text-lg leading-8 text-gray-700'
        },
        bodySmall: {
            element: 'p' as const,
            styles: 'text-sm leading-6 text-gray-600'
        },
        label: {
            element: 'label' as const,
            styles: 'text-sm font-medium leading-none text-gray-900'
        },
        caption: {
            element: 'span' as const,
            styles: 'text-xs leading-5 text-gray-500'
        },
        overline: {
            element: 'span' as const,
            styles: 'text-xs font-medium uppercase tracking-wide text-gray-500'
        }
    };

    const { element: defaultElement, styles } = variants[variant];
    const Element = (as || defaultElement) as keyof JSX.IntrinsicElements;

    return React.createElement(
        Element,
        {
            className: cn(styles, className),
            ...rest
        },
        children
    );
};

export default Typography;