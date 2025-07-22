import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PatientDetail } from '@/components/PatientDetail';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePatient, usePatientMutations } from '@/hooks/usePatients';
import { CreatePatientRequest, UpdatePatientRequest } from '../../../shared/types';
import Seo from '../components/Seo';

export default function Patient() {
    const [patientId, setPatientId] = useState<string | null>('1'); // Mock ID for now
    const [mode, setMode] = useState<'view' | 'edit' | 'create'>('view');

    const { data: currentPatient, loading, error, refresh } = usePatient(patientId);
    const {
        createPatient,
        updatePatient,
        loading: mutationLoading,
        error: mutationError,
        clearError
    } = usePatientMutations();

    const handleSave = async (patientData: CreatePatientRequest | UpdatePatientRequest) => {
        clearError();

        try {
            if (mode === 'create') {
                const newPatient = await createPatient(patientData as CreatePatientRequest);
                if (newPatient) {
                    setPatientId(newPatient.id);
                    setMode('view');
                    console.log('Patient created successfully:', newPatient);
                }
            } else if (mode === 'edit' && patientId) {
                const updatedPatient = await updatePatient(patientId, patientData as UpdatePatientRequest);
                if (updatedPatient) {
                    setMode('view');
                    refresh(); // Refresh the patient data
                    console.log('Patient updated successfully:', updatedPatient);
                }
            }
        } catch (error) {
            console.error('Error saving patient:', error);
        }
    };

    const handleCreateNew = () => {
        setPatientId(null);
        setMode('create');
        clearError();
    };

    const handleCancel = () => {
        if (mode === 'create') {
            setPatientId('1'); // Go back to mock patient
            setMode('view');
        } else {
            setMode('view');
        }
        clearError();
    };

    // Create empty patient data for create mode
    const emptyPatient = {
        firstName: '',
        lastName: '',
        address: '',
        age: 0,
        gender: 'male' as const,
        maritalStatus: '',
        occupation: '',
        phone: '',
        vaccination: [],
        visitDate: new Date().toISOString().split('T')[0],
        notes: []
    };

    return (
        <>
            <Seo
                title="Patient | Clínica Médica Cuyún Gaitán"
                description="Patient management page for Clínica Médica Cuyún Gaitán."
            />
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {mode === 'create' ? 'Nuevo Paciente' : 'Información del Paciente'}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {mode === 'create'
                                    ? 'Registrar un nuevo paciente en el sistema'
                                    : currentPatient ? `Detalles de ${currentPatient.firstName} ${currentPatient.lastName}` : 'Cargando...'
                                }
                            </p>
                        </div>
                        {mode === 'view' && (
                            <Button
                                onClick={handleCreateNew}
                                className="bg-accentBlue hover:bg-blue-600"
                            >
                                Nuevo Paciente
                            </Button>
                        )}
                    </div>

                    {/* Error Display */}
                    {(error || mutationError) && (
                        <Alert className="mb-4">
                            <AlertDescription>
                                {error || mutationError}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Loading State */}
                    {loading && mode !== 'create' && (
                        <div className="text-center py-8">
                            <p>Cargando información del paciente...</p>
                        </div>
                    )}

                    {/* Patient Detail Component */}
                    {(currentPatient || mode === 'create') && (
                        <PatientDetail
                            patient={mode === 'create' ? emptyPatient as any : (currentPatient as any || undefined)}
                            mode={mode}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}