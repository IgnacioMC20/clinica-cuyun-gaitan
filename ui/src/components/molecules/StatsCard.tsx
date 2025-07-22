import React from 'react';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
        label?: string;
    };
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
    className?: string;
    onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    trend,
    color = 'blue',
    className,
    onClick
}) => {
    const colorStyles = {
        blue: {
            icon: 'text-blue-600 bg-blue-100',
            trend: 'text-blue-600'
        },
        green: {
            icon: 'text-green-600 bg-green-100',
            trend: 'text-green-600'
        },
        yellow: {
            icon: 'text-yellow-600 bg-yellow-100',
            trend: 'text-yellow-600'
        },
        red: {
            icon: 'text-red-600 bg-red-100',
            trend: 'text-red-600'
        },
        gray: {
            icon: 'text-gray-600 bg-gray-100',
            trend: 'text-gray-600'
        }
    };

    const formatValue = (val: string | number) => {
        if (typeof val === 'number') {
            return val.toLocaleString('es-GT');
        }
        return val;
    };

    const trendIcon = trend && (
        <svg
            className={cn(
                'h-4 w-4',
                trend.isPositive ? 'text-green-500' : 'text-red-500'
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
        >
            {trend.isPositive ? (
                <path
                    fillRule="evenodd"
                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                />
            ) : (
                <path
                    fillRule="evenodd"
                    d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                />
            )}
        </svg>
    );

    return (
        <Card
            className={cn(
                'transition-all duration-200',
                onClick && 'cursor-pointer hover:shadow-md hover:bg-gray-50',
                className
            )}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <Typography variant="bodySmall" className="text-gray-600 font-medium">
                        {title}
                    </Typography>

                    <Typography variant="h3" className="mt-2 text-gray-900">
                        {formatValue(value)}
                    </Typography>

                    {subtitle && (
                        <Typography variant="caption" className="text-gray-500 mt-1">
                            {subtitle}
                        </Typography>
                    )}

                    {trend && (
                        <div className="flex items-center mt-2 space-x-1">
                            {trendIcon}
                            <Typography
                                variant="bodySmall"
                                className={cn(
                                    'font-medium',
                                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                                )}
                            >
                                {trend.value > 0 ? '+' : ''}{trend.value}%
                            </Typography>
                            {trend.label && (
                                <Typography variant="bodySmall" className="text-gray-500">
                                    {trend.label}
                                </Typography>
                            )}
                        </div>
                    )}
                </div>

                {icon && (
                    <div className={cn(
                        'flex-shrink-0 p-3 rounded-lg',
                        colorStyles[color].icon
                    )}>
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default StatsCard;