import React from 'react';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { type PatientNote } from '../../../../shared/types/patient';
import { cn } from '@/lib/utils';

interface NoteItemProps {
    note: PatientNote;
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean;
    compact?: boolean;
    className?: string;
}

export const NoteItem: React.FC<NoteItemProps> = ({
    note,
    onEdit,
    onDelete,
    showActions = true,
    compact = false,
    className
}) => {
    const formatDate = (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('es-GT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const editIcon = (
        <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
        </svg>
    );

    const deleteIcon = (
        <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
        </svg>
    );

    return (
        <Card
            className={cn(
                'transition-all duration-200',
                compact ? 'p-3' : 'p-4',
                className
            )}
            padding="none"
        >
            <div className="space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <Typography
                            variant={compact ? 'bodySmall' : 'body'}
                            className="font-semibold text-gray-900"
                        >
                            {note.title}
                        </Typography>

                        <Typography
                            variant="caption"
                            className="text-gray-500 mt-1"
                        >
                            {formatDate(note.date)}
                        </Typography>
                    </div>

                    {showActions && (onEdit || onDelete) && (
                        <div className="flex items-center space-x-2 ml-4">
                            {onEdit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onEdit}
                                    className="h-8 w-8 p-0"
                                    aria-label="Editar nota"
                                >
                                    {editIcon}
                                </Button>
                            )}

                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onDelete}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    aria-label="Eliminar nota"
                                >
                                    {deleteIcon}
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className="prose prose-sm max-w-none">
                    <Typography
                        variant={compact ? 'bodySmall' : 'body'}
                        className="text-gray-700 whitespace-pre-wrap"
                    >
                        {note.content}
                    </Typography>
                </div>
            </div>
        </Card>
    );
};

export default NoteItem;