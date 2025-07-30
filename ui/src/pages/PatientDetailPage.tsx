import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PatientForm, NotesList } from '../components/organisms';
import { Button, Typography, Card, Spinner } from '../components/atoms';
import { usePatient, useDeletePatient } from '../hooks/usePatients';
import type { PatientNote } from '../../../shared/types/patient';
import { ArrowLeft, Edit, Trash2, FileText } from 'lucide-react';

export const PatientDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { data: patient, isLoading, error } = usePatient(id || '');
    const deletePatientMutation = useDeletePatient();

    const handleBack = () => {
        navigate('/tablero');
    };

    const handleEdit = () => {
        setMode('edit');
    };

    const handleCancelEdit = () => {
        setMode('view');
    };

    const handleSaveSuccess = () => {
        setMode('view');
        // Patient data will be automatically updated via TanStack Query
    };

    const handleDelete = async () => {
        if (!patient) return;

        try {
            await deletePatientMutation.mutateAsync(patient.id);
            navigate('/tablero');
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    const handleNoteAdded = (note: PatientNote) => {
        // Notes will be automatically updated via TanStack Query
        console.log('Note added:', note);
    };

    const handleNoteUpdated = (noteId: string, note: PatientNote) => {
        // Handle note update
        console.log('Note updated:', noteId, note);
    };

    const handleNoteDeleted = (noteId: string) => {
        // Handle note deletion
        console.log('Note deleted:', noteId);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Spinner size="lg" />
                    <Typography variant="body" className="mt-4 text-gray-600">
                        Cargando información del paciente...
                    </Typography>
                </div>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="p-8 max-w-md mx-auto text-center">
                    <Typography variant="h3" className="text-destructive mb-4">
                        Error al cargar paciente
                    </Typography>
                    <Typography variant="body" className="text-gray-600 mb-6">
                        {error?.message || 'No se pudo encontrar la información del paciente.'}
                    </Typography>
                    <Button onClick={handleBack}>
                        Volver
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    className="flex items-center space-x-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Volver</span>
                                </Button>
                                <div>
                                    <Typography variant="h2" className="text-gray-900">
                                        {patient.firstName} {patient.lastName}
                                    </Typography>
                                    <Typography variant="body" className="text-gray-600">
                                        {mode === 'view' ? 'Información del paciente' : 'Editando información'}
                                    </Typography>
                                </div>
                            </div>

                            {mode === 'view' && (
                                <div className="flex items-center space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleEdit}
                                        className="flex items-center space-x-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Editar</span>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="flex items-center space-x-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Eliminar</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Patient Form */}
                    <div>
                        <PatientForm
                            patient={patient}
                            mode={mode}
                            onSuccess={handleSaveSuccess}
                            onCancel={handleCancelEdit}
                        />
                    </div>

                    {/* Notes Section */}
                    <div>
                        <NotesList
                            patient={patient}
                            notes={patient.notes || []}
                            onNoteAdded={handleNoteAdded}
                            onNoteUpdated={handleNoteUpdated}
                            onNoteDeleted={handleNoteDeleted}
                            readOnly={mode === 'edit'} // Disable notes editing when editing patient info
                        />
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="p-6 max-w-md mx-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <Typography variant="h3" className="mb-2">
                                Eliminar Paciente
                            </Typography>
                            <Typography variant="body" className="text-gray-600 mb-6">
                                ¿Está seguro que desea eliminar a {patient.firstName} {patient.lastName}?
                                Esta acción no se puede deshacer y se perderán todas las notas médicas asociadas.
                            </Typography>
                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1"
                                    disabled={deletePatientMutation.isPending}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    className="flex-1"
                                    loading={deletePatientMutation.isPending}
                                    disabled={deletePatientMutation.isPending}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Quick Stats */}
            {mode === 'view' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <Card className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <FileText className="w-5 h-5 text-primary" />
                            <Typography variant="h3">
                                Resumen Rápido
                            </Typography>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <Typography variant="h2" className="text-primary">
                                    {patient.age}
                                </Typography>
                                <Typography variant="bodySmall" className="text-gray-600">
                                    Años de edad
                                </Typography>
                            </div>
                            <div className="text-center">
                                <Typography variant="h2" className="text-primary">
                                    {patient.notes?.length || 0}
                                </Typography>
                                <Typography variant="bodySmall" className="text-gray-600">
                                    Notas médicas
                                </Typography>
                            </div>
                            <div className="text-center">
                                <Typography variant="h2" className="text-primary">
                                    {new Date(patient.visitDate).toLocaleDateString('es-GT', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </Typography>
                                <Typography variant="bodySmall" className="text-gray-600">
                                    Última visita
                                </Typography>
                            </div>
                            <div className="text-center">
                                <Typography variant="h2" className="text-primary">
                                    {patient.vaccination?.length || 0}
                                </Typography>
                                <Typography variant="bodySmall" className="text-gray-600">
                                    Vacunas registradas
                                </Typography>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PatientDetailPage;
