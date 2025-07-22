import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    label: string;
    value: number | string;
    icon?: React.ReactNode;
    className?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export function StatsCard({ label, value, icon, className, trend }: StatsCardProps) {
    return (
        <Card className={cn("bg-hospitalWhite border-gray-200 hover:shadow-md transition-shadow", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                    {label}
                </CardTitle>
                {icon && (
                    <div className="text-accentBlue">
                        {icon}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                    {value}
                </div>
                {trend && (
                    <p className={cn(
                        "text-xs mt-1",
                        trend.isPositive ? "text-green-600" : "text-red-600"
                    )}>
                        <span className={cn(
                            "inline-flex items-center",
                            trend.isPositive ? "text-green-600" : "text-red-600"
                        )}>
                            {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
                        </span>
                        <span className="text-gray-500 ml-1">from last month</span>
                    </p>
                )}
            </CardContent>
        </Card>
    );
}