import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePatients } from '@/hooks/usePatients';
import { PatientResponse } from '../../../shared/types';
import { cn } from '@/lib/utils';

interface PatientSearchProps {
    onPatientSelect?: (patient: PatientResponse) => void;
    className?: string;
}

export function PatientSearch({ onPatientSelect, className }: PatientSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const { data, loading, fetchPatients } = usePatients();

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.trim()) {
                fetchPatients({
                    query: searchTerm.trim(),
                    limit: 10
                });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, fetchPatients]);

    const results = data?.patients || [];

    const getGenderBadgeColor = (gender: string) => {
        switch (gender) {
            case 'male': return 'bg-blue-100 text-blue-800';
            case 'female': return 'bg-pink-100 text-pink-800';
            case 'child': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getGenderLabel = (gender: string) => {
        switch (gender) {
            case 'male': return 'Masculino';
            case 'female': return 'Femenino';
            case 'child': return 'Niño/a';
            default: return gender;
        }
    };

    return (
        <div className={cn("w-full max-w-md", className)}>
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Buscar paciente por nombre o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accentBlue"></div>
                    </div>
                )}
            </div>

            {results.length > 0 && (
                <Card className="mt-2 max-h-64 overflow-y-auto">
                    <CardContent className="p-0">
                        {results.map((patient) => (
                            <div
                                key={patient.id}
                                className="p-3 hover:bg-hospitalBlue cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                onClick={() => onPatientSelect?.(patient)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">
                                            {patient.firstName} {patient.lastName}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {patient.age} años • {patient.phone}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Última visita: {new Date(patient.visitDate).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                    <Badge className={getGenderBadgeColor(patient.gender)}>
                                        {getGenderLabel(patient.gender)}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {searchTerm && !loading && results.length === 0 && (
                <Card className="mt-2">
                    <CardContent className="p-4 text-center text-gray-500">
                        No se encontraron pacientes
                    </CardContent>
                </Card>
            )}
        </div>
    );
}