import React, { useState, useEffect } from 'react';
import { Button, Card, Typography } from '../atoms';
import { FormField } from '../molecules';
import { useCreatePatient, useUpdatePatient } from '../../hooks/usePatients';
import type { PatientResponse, CreatePatientRequest } from '../../../../shared/types/patient';
import { GENDER_LABELS } from '../../../../shared/types/patient';
import { useMedicalNotifications } from '../../lib/utils/notifications';
import { calculateAge, isValidBirthdate } from '../../../../shared/utils/dateUtils';

interface PatientFormProps {
    patient?: PatientResponse;
    mode: 'create' | 'edit' | 'view';
    onSuccess?: (patient: PatientResponse) => void;
    onCancel?: () => void;
}

interface FormData {
    firstName: string;
    lastName: string;
    address: string;
    birthdate: string;
    gender: 'male' | 'female' | 'child';
    maritalStatus: string;
    occupation: string;
    phone: string;
    vaccination: string[];
    visitDate: string;
}

const initialFormData: FormData = {
    firstName: '',
    lastName: '',
    address: '',
    birthdate: '',
    gender: 'male',
    maritalStatus: '',
    occupation: '',
    phone: '',
    vaccination: [],
    visitDate: new Date().toISOString().split('T')[0],
};

export const PatientForm: React.FC<PatientFormProps> = ({
    patient,
    mode,
    onSuccess,
    onCancel
}) => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    const createPatientMutation = useCreatePatient();
    const updatePatientMutation = useUpdatePatient();
    const { notifyPatientCreated, notifyPatientUpdated, notifyFormValidationError, showError } = useMedicalNotifications();

    const isLoading = createPatientMutation.isPending || updatePatientMutation.isPending;
    const isReadOnly = mode === 'view';

    // Initialize form data when patient prop changes
    useEffect(() => {
        if (patient) {
            setFormData({
                firstName: patient.firstName,
                lastName: patient.lastName,
                address: patient.address || '',
                birthdate: patient.birthdate
                    ? (typeof patient.birthdate === 'string'
                        ? patient.birthdate.split('T')[0]
                        : new Date(patient.birthdate).toISOString().split('T')[0])
                    : '',
                gender: patient.gender || 'male',
                maritalStatus: patient.maritalStatus || '',
                occupation: patient.occupation || '',
                phone: patient.phone || '',
                vaccination: patient.vaccination || [],
                visitDate: typeof patient.visitDate === 'string'
                    ? patient.visitDate.split('T')[0]
                    : new Date(patient.visitDate || new Date()).toISOString().split('T')[0],
            });
        } else {
            setFormData(initialFormData);
        }
    }, [patient]);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        // Solo nombre y apellido son requeridos
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre es requerido';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'El apellido es requerido';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
        }

        if (formData.birthdate && !isValidBirthdate(formData.birthdate)) {
            newErrors.birthdate = 'La fecha de nacimiento debe ser válida y no puede ser futura';
        }

        if (formData.phone.trim() && formData.phone.length < 8) {
            newErrors.phone = 'El teléfono debe tener al menos 8 dígitos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            notifyFormValidationError();
            return;
        }

        const submitData: CreatePatientRequest = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            ...(formData.address?.trim() && { address: formData.address }),
            ...(formData.birthdate && { birthdate: formData.birthdate }),
            ...(formData.gender && { gender: formData.gender }),
            ...(formData.maritalStatus?.trim() && { maritalStatus: formData.maritalStatus }),
            ...(formData.occupation?.trim() && { occupation: formData.occupation }),
            ...(formData.phone?.trim() && { phone: formData.phone }),
            ...(formData.vaccination.length > 0 && { vaccination: formData.vaccination }),
            ...(formData.visitDate && { visitDate: formData.visitDate }),
        };

        try {
            if (mode === 'create') {
                const result = await createPatientMutation.mutateAsync(submitData);
                notifyPatientCreated();
                onSuccess?.(result);
            } else if (mode === 'edit' && patient) {
                const result = await updatePatientMutation.mutateAsync({
                    id: patient.id,
                    data: submitData
                });
                notifyPatientUpdated();
                onSuccess?.(result);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showError(
                'Error al Guardar',
                'No se pudo guardar la información del paciente. Intente nuevamente.'
            );
        }
    };

    const handleFieldChange = (field: keyof FormData, value: string | number | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const genderOptions = Object.entries(GENDER_LABELS).map(([value, label]) => ({
        value,
        label
    }));

    const maritalStatusOptions = [
        { value: 'soltero', label: 'Soltero/a' },
        { value: 'casado', label: 'Casado/a' },
        { value: 'divorciado', label: 'Divorciado/a' },
        { value: 'viudo', label: 'Viudo/a' },
        { value: 'union_libre', label: 'Unión Libre' },
    ];

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <div className="p-6">
                <div className="mb-6">
                    <Typography variant="h2" className="mb-2">
                        {mode === 'create' ? 'Nuevo Paciente' :
                            mode === 'edit' ? 'Editar Paciente' : 'Información del Paciente'}
                    </Typography>
                    <Typography variant="body" className="text-muted-foreground">
                        {mode === 'create' ? 'Complete la información del nuevo paciente' :
                            mode === 'edit' ? 'Modifique la información del paciente' :
                                'Información detallada del paciente'}
                    </Typography>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                        <Typography variant="h3" className="mb-4">Información Personal</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                type="input"
                                label="Nombre"
                                name="firstName"
                                value={formData.firstName}
                                onChange={(value) => handleFieldChange('firstName', value)}
                                error={errors.firstName}
                                required
                                disabled={isReadOnly}
                                placeholder="Ingrese el nombre"
                            />
                            <FormField
                                type="input"
                                label="Apellido"
                                name="lastName"
                                value={formData.lastName}
                                onChange={(value) => handleFieldChange('lastName', value)}
                                error={errors.lastName}
                                required
                                disabled={isReadOnly}
                                placeholder="Ingrese el apellido"
                            />
                            <FormField
                                type="input"
                                label="Fecha de Nacimiento"
                                name="birthdate"
                                inputType="date"
                                value={formData.birthdate}
                                onChange={(value) => handleFieldChange('birthdate', value)}
                                error={errors.birthdate}
                                disabled={isReadOnly}
                                placeholder="Fecha de nacimiento (opcional)"
                                helperText={formData.birthdate ? `Edad: ${calculateAge(formData.birthdate)} años` : undefined}
                            />
                            <FormField
                                label="Género"
                                name="gender"
                                type="select"
                                options={genderOptions}
                                value={formData.gender}
                                onChange={(value) => handleFieldChange('gender', value as 'male' | 'female' | 'child')}
                                error={errors.gender}
                                disabled={isReadOnly}
                                placeholder="Seleccione género (opcional)"
                            />
                            <FormField
                                label="Estado Civil"
                                name="maritalStatus"
                                type="select"
                                options={maritalStatusOptions}
                                value={formData.maritalStatus}
                                onChange={(value) => handleFieldChange('maritalStatus', value)}
                                error={errors.maritalStatus}
                                disabled={isReadOnly}
                                placeholder="Seleccione estado civil (opcional)"
                            />
                            <FormField
                                type="input"
                                label="Ocupación"
                                name="occupation"
                                value={formData.occupation}
                                onChange={(value) => handleFieldChange('occupation', value)}
                                error={errors.occupation}
                                disabled={isReadOnly}
                                placeholder="Ocupación o profesión (opcional)"
                            />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <Typography variant="h3" className="mb-4">Información de Contacto</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                type="input"
                                label="Teléfono"
                                name="phone"
                                inputType="tel"
                                value={formData.phone}
                                onChange={(value) => handleFieldChange('phone', value)}
                                error={errors.phone}
                                disabled={isReadOnly}
                                placeholder="Número de teléfono (opcional)"
                            />
                            <FormField
                                type="input"
                                label="Fecha de Visita"
                                name="visitDate"
                                inputType="date"
                                value={formData.visitDate}
                                onChange={(value) => handleFieldChange('visitDate', value)}
                                error={errors.visitDate}
                                disabled={isReadOnly}
                                placeholder="Fecha de visita (opcional)"
                            />
                        </div>
                        <div className="mt-4">
                            <FormField
                                label="Dirección"
                                name="address"
                                type="textarea"
                                value={formData.address}
                                onChange={(value) => handleFieldChange('address', value)}
                                error={errors.address}
                                disabled={isReadOnly}
                                placeholder="Dirección completa del paciente (opcional)"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    {!isReadOnly && (
                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            {onCancel && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </Button>
                            )}
                            <Button
                                type="submit"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {mode === 'create' ? 'Crear Paciente' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </Card>
    );
};
