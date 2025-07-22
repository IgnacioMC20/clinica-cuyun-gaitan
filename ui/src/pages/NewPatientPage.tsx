import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientForm } from '../components/organisms';
import { Button, Typography, Card } from '../components/atoms';
import type { PatientResponse } from '../../../shared/types/patient';
import { ArrowLeft, UserPlus } from 'lucide-react';

export const NewPatientPage: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    };

    const handleSuccess = (patient: PatientResponse) => {
        // Navigate to the newly created patient's detail page
        navigate(`/patient/${patient.id}`);
    };

    const handleCancel = () => {
        navigate('/');
    };

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
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <UserPlus className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <Typography variant="h2" className="text-gray-900">
                                            Nuevo Paciente
                                        </Typography>
                                        <Typography variant="body" className="text-gray-600">
                                            Registrar información de un nuevo paciente
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Instructions Card */}
                <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
                    <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <Typography variant="h4" className="text-blue-900 mb-2">
                                Información importante
                            </Typography>
                            <Typography variant="body" className="text-blue-800">
                                Complete todos los campos requeridos para registrar al nuevo paciente.
                                La información será guardada de forma segura y podrá ser editada posteriormente.
                            </Typography>
                            <ul className="mt-3 space-y-1 text-blue-700">
                                <li className="flex items-center space-x-2">
                                    <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                                    <Typography variant="bodySmall">Todos los campos marcados con (*) son obligatorios</Typography>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                                    <Typography variant="bodySmall">La fecha de visita se establece automáticamente al día actual</Typography>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                                    <Typography variant="bodySmall">Podrá agregar notas médicas después de crear el paciente</Typography>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>

                {/* Patient Form */}
                <PatientForm
                    mode="create"
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />

                {/* Help Section */}
                <Card className="p-6 mt-8 bg-gray-50">
                    <Typography variant="h4" className="mb-4">
                        ¿Necesita ayuda?
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Typography variant="bodyLarge" className="font-medium mb-2">
                                Campos obligatorios
                            </Typography>
                            <Typography variant="body" className="text-gray-600">
                                Asegúrese de completar todos los campos marcados con asterisco (*).
                                Estos son necesarios para el registro del paciente.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="bodyLarge" className="font-medium mb-2">
                                Información de contacto
                            </Typography>
                            <Typography variant="body" className="text-gray-600">
                                Verifique que el número de teléfono y la dirección sean correctos
                                para poder contactar al paciente cuando sea necesario.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="bodyLarge" className="font-medium mb-2">
                                Datos médicos
                            </Typography>
                            <Typography variant="body" className="text-gray-600">
                                La información médica básica como edad y género es importante
                                para el seguimiento y tratamiento adecuado.
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="bodyLarge" className="font-medium mb-2">
                                Después del registro
                            </Typography>
                            <Typography variant="body" className="text-gray-600">
                                Una vez creado el paciente, será redirigido a su página de detalles
                                donde podrá agregar notas médicas y editar información.
                            </Typography>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <Typography variant="bodySmall" className="text-gray-500">
                            Clínica Médica Cuyún Gaitán - Sistema de gestión de pacientes
                        </Typography>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" onClick={handleBack}>
                                Cancelar y volver
                            </Button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default NewPatientPage;
