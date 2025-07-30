import React from 'react';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Typography } from '../atoms/Typography';
import { type IPatient, GENDER_LABELS } from '../../../../shared/types/patient';
import { calculateAge } from '../../../../shared/utils/dateUtils';
import { cn } from '@/lib/utils';

interface PatientCardProps {
    patient: IPatient;
    onClick?: () => void;
    selected?: boolean;
    showAvatar?: boolean;
    compact?: boolean;
    className?: string;
}

export const PatientCard: React.FC<PatientCardProps> = ({
    patient,
    onClick,
    selected = false,
    showAvatar = true,
    compact = false,
    className
}) => {
    const getGenderBadgeVariant = (gender: string) => {
        switch (gender) {
            case 'male':
                return 'info';
            case 'female':
                return 'success';
            case 'child':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const formatDate = (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('es-GT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const avatar = showAvatar && (
        <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Typography variant="label" className="text-gray-600">
                    {getInitials(patient.firstName, patient.lastName)}
                </Typography>
            </div>
        </div>
    );

    return (
        <Card
            className={cn(
                'transition-all duration-200 cursor-pointer hover:shadow-md',
                selected && 'ring-2 ring-blue-500 bg-blue-50',
                onClick && 'hover:bg-gray-50',
                compact ? 'p-3' : 'p-4',
                className
            )}
            onClick={onClick}
            padding="none"
        >
            <div className={cn('flex items-center space-x-3', compact && 'space-x-2')}>
                {avatar}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <Typography
                            variant={compact ? 'bodySmall' : 'body'}
                            className="font-semibold text-gray-900 truncate"
                        >
                            {patient.firstName} {patient.lastName}
                        </Typography>

                        <Badge variant={getGenderBadgeVariant(patient.gender)}>
                            {GENDER_LABELS[patient.gender as keyof typeof GENDER_LABELS]}
                        </Badge>
                    </div>

                    <div className={cn('mt-1 flex items-center space-x-4', compact && 'space-x-2')}>
                        <Typography variant="bodySmall" className="text-gray-500">
                            {calculateAge(patient.birthdate)} años
                        </Typography>

                        {!compact && (
                            <>
                                <span className="text-gray-300">•</span>
                                <Typography variant="bodySmall" className="text-gray-500">
                                    {patient.phone}
                                </Typography>
                            </>
                        )}
                    </div>

                    {!compact && (
                        <Typography variant="caption" className="text-gray-400 mt-1">
                            Última visita: {formatDate(patient.visitDate)}
                        </Typography>
                    )}
                </div>
            </div>

            {!compact && patient.notes && patient.notes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <Typography variant="caption" className="text-gray-500">
                        {patient.notes.length} nota{patient.notes.length !== 1 ? 's' : ''}
                    </Typography>
                </div>
            )}
        </Card>
    );
};

export default PatientCard;