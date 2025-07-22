import React, { useState } from 'react';
import { DashboardPanel, PatientSelector } from '../components/organisms';
import { Typography } from '../components/atoms';
import type { PatientResponse } from '../../../shared/types/patient';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
    const [selectedPatient, setSelectedPatient] = useState<PatientResponse | null>(null);
    const navigate = useNavigate();

    const handleCreatePatient = () => {
        navigate('/patient/new');
    };

    const handleViewAllPatients = () => {
        navigate(`/patients`);
    };

    const handleViewRecentVisits = () => {
        // For now, just show recent visits in dashboard
        console.log('View recent visits - functionality to be implemented');
    };

    const handlePatientSelect = (patient: PatientResponse) => {
        setSelectedPatient(patient);
        navigate(`/patient/${patient.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <Typography variant="h1" className="text-gray-900">
                            Clínica Médica Cuyún Gaitán
                        </Typography>
                        <Typography variant="body" className="text-gray-600 mt-2">
                            Sistema de gestión de pacientes
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Dashboard Panel - Takes 2 columns on large screens */}
                    <div className="lg:col-span-2">
                        <DashboardPanel
                            onCreatePatient={handleCreatePatient}
                            onViewAllPatients={handleViewAllPatients}
                            onViewRecentVisits={handleViewRecentVisits}
                        />
                    </div>

                    {/* Patient Selector - Takes 1 column on large screens */}
                    <div className="lg:col-span-1">
                        <PatientSelector
                            onPatientSelect={handlePatientSelect}
                            onCreateNew={handleCreatePatient}
                            selectedPatientId={selectedPatient?.id}
                            compact={true}
                            maxHeight="800px"
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <Typography variant="bodySmall" className="text-gray-500">
                            © 2025 Clínica Médica Cuyún Gaitán. Todos los derechos reservados.
                        </Typography>
                        <Typography variant="bodySmall" className="text-gray-500">
                            Sistema de gestión médica v1.0
                        </Typography>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DashboardPage;
