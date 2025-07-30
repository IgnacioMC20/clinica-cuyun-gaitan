import React, { useState, useMemo } from 'react';
import { Card, Typography, Button, Spinner } from '../atoms';
import { SearchInput, PatientCard } from '../molecules';
import { usePatients } from '../../hooks/usePatients';
import type { PatientResponse, PatientSearchParams } from '../../../../shared/types/patient';

interface PatientSelectorProps {
    onPatientSelect?: (patient: PatientResponse) => void;
    onCreateNew?: () => void;
    selectedPatientId?: string;
    compact?: boolean;
    maxHeight?: string;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({
    onPatientSelect,
    onCreateNew,
    selectedPatientId,
    compact = false,
    maxHeight = '600px'
}) => {
    const [searchParams, setSearchParams] = useState<Partial<PatientSearchParams>>({
        limit: 20,
        offset: 0
    });

    const safeSetSearchParams = (
        updater: (prev: Partial<PatientSearchParams>) => Partial<PatientSearchParams>
    ) => {
        setSearchParams(prev => {
            const next = updater(prev);
            return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
        });
    };

    const { data: patientsData, isLoading, error, isError } = usePatients(searchParams);

    const handleSearch = (query: string) => {
        safeSetSearchParams(prev => ({
            ...prev,
            query: query.trim() || undefined,
            offset: 0
        }));
    };

    const handleLoadMore = () => {
        if (patientsData && patientsData.patients.length < patientsData.total) {
            safeSetSearchParams(prev => ({
                ...prev,
                offset: (prev.offset || 0) + (prev.limit || 20)
            }));
        }
    };

    const hasMorePatients = useMemo(() => {
        if (!patientsData) return false;
        return patientsData.patients.length < patientsData.total;
    }, [patientsData]);

    const handlePatientClick = (patient: PatientResponse) => {
        onPatientSelect?.(patient);
    };

    if (isError) {
        return (
            <Card className="p-6">
                <div className="text-center">
                    <Typography variant="h3" className="text-destructive mb-2">
                        Error al cargar pacientes
                    </Typography>
                    <Typography variant="body" className="text-muted-foreground mb-4">
                        {error?.message || 'Ocurrió un error inesperado'}
                    </Typography>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col h-full">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                    <Typography variant="h3">
                        Pacientes
                        {patientsData && (
                            <span className="text-muted-foreground ml-2">
                                ({patientsData.total})
                            </span>
                        )}
                    </Typography>
                    {onCreateNew && (
                        <Button onClick={onCreateNew} size="sm">
                            Nuevo Paciente
                        </Button>
                    )}
                </div>

                <SearchInput
                    placeholder="Buscar pacientes..."
                    onSearch={handleSearch}
                    debounceMs={300}
                />
            </div>

            <div
                className="flex-1 overflow-y-auto p-4"
                style={{ maxHeight }}
            >
                {isLoading && !patientsData ? (
                    <div className="flex items-center justify-center py-8">
                        <Spinner size="lg" />
                        <Typography variant="body" className="ml-3">
                            Cargando pacientes...
                        </Typography>
                    </div>
                ) : !patientsData?.patients.length ? (
                    <div className="text-center py-8">
                        <Typography variant="h4" className="text-muted-foreground mb-2">
                            {patientsData?.total === 0 && !searchParams.query
                                ? 'No hay pacientes registrados'
                                : 'No se encontraron pacientes'
                            }
                        </Typography>
                        <Typography variant="body" className="text-muted-foreground mb-4">
                            {patientsData?.total === 0 && !searchParams.query
                                ? 'Comienza agregando tu primer paciente al sistema'
                                : searchParams.query
                                    ? 'Intenta con otros términos de búsqueda'
                                    : 'Comienza agregando tu primer paciente'
                            }
                        </Typography>
                        {onCreateNew && (patientsData?.total === 0 || !searchParams.query) && (
                            <Button onClick={onCreateNew}>
                                {patientsData?.total === 0 ? 'Agregar Primer Paciente' : 'Agregar Primer Paciente'}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {patientsData.patients.map((patient) => (
                            <div
                                key={patient.id}
                                className={`transition-all ${selectedPatientId === patient.id
                                    ? 'ring-2 ring-primary ring-offset-2'
                                    : ''
                                    }`}
                            >
                                <PatientCard
                                    patient={patient}
                                    onClick={() => handlePatientClick(patient)}
                                    compact={compact}
                                    selected={selectedPatientId === patient.id}
                                />
                            </div>
                        ))}

                        {hasMorePatients && (
                            <div className="pt-4 text-center">
                                <Button
                                    variant="outline"
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                    loading={isLoading}
                                >
                                    Cargar más pacientes
                                </Button>
                            </div>
                        )}

                        {isLoading && patientsData && (
                            <div className="flex items-center justify-center py-4">
                                <Spinner size="sm" />
                                <Typography variant="bodySmall" className="ml-2 text-muted-foreground">
                                    Cargando más pacientes...
                                </Typography>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {patientsData && patientsData.patients.length > 0 && (
                <div className="p-4 border-t bg-muted/10">
                    <Typography variant="bodySmall" className="text-muted-foreground text-center">
                        Mostrando {patientsData.patients.length} de {patientsData.total} pacientes
                        {searchParams.query && (
                            <span> • Búsqueda: "{searchParams.query}"</span>
                        )}
                    </Typography>
                </div>
            )}
        </Card>
    );
};
