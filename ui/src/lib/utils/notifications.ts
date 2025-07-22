import { useNotification } from '../contexts/NotificationContext';

// Medical-specific notification messages
export const MEDICAL_NOTIFICATIONS = {
    // Patient operations
    PATIENT_CREATED: {
        title: 'Paciente Registrado',
        message: 'El paciente ha sido registrado exitosamente en el sistema.'
    },
    PATIENT_UPDATED: {
        title: 'Paciente Actualizado',
        message: 'La información del paciente ha sido actualizada correctamente.'
    },
    PATIENT_DELETED: {
        title: 'Paciente Eliminado',
        message: 'El paciente y toda su información médica han sido eliminados del sistema.'
    },
    PATIENT_NOT_FOUND: {
        title: 'Paciente No Encontrado',
        message: 'No se pudo encontrar el paciente solicitado.'
    },
    PATIENT_SEARCH_ERROR: {
        title: 'Error en Búsqueda',
        message: 'No se pudo realizar la búsqueda de pacientes. Intente nuevamente.'
    },

    // Medical notes operations
    NOTE_ADDED: {
        title: 'Nota Médica Agregada',
        message: 'La nota médica ha sido guardada exitosamente.'
    },
    NOTE_UPDATED: {
        title: 'Nota Médica Actualizada',
        message: 'La nota médica ha sido actualizada correctamente.'
    },
    NOTE_DELETED: {
        title: 'Nota Médica Eliminada',
        message: 'La nota médica ha sido eliminada del expediente.'
    },
    NOTE_SAVE_ERROR: {
        title: 'Error al Guardar Nota',
        message: 'No se pudo guardar la nota médica. Verifique la información e intente nuevamente.'
    },

    // Form validation
    FORM_VALIDATION_ERROR: {
        title: 'Información Incompleta',
        message: 'Por favor complete todos los campos requeridos antes de continuar.'
    },
    FORM_SAVE_ERROR: {
        title: 'Error al Guardar',
        message: 'No se pudo guardar la información. Verifique los datos e intente nuevamente.'
    },

    // Network and system errors
    NETWORK_ERROR: {
        title: 'Error de Conexión',
        message: 'No se pudo conectar con el servidor. Verifique su conexión a internet.'
    },
    SERVER_ERROR: {
        title: 'Error del Servidor',
        message: 'Ocurrió un error en el servidor. Intente nuevamente en unos momentos.'
    },
    UNAUTHORIZED_ERROR: {
        title: 'Acceso No Autorizado',
        message: 'No tiene permisos para realizar esta acción.'
    },

    // Success operations
    DATA_SAVED: {
        title: 'Información Guardada',
        message: 'Los cambios han sido guardados exitosamente.'
    },
    OPERATION_SUCCESS: {
        title: 'Operación Exitosa',
        message: 'La operación se completó correctamente.'
    },

    // Warning messages
    UNSAVED_CHANGES: {
        title: 'Cambios Sin Guardar',
        message: 'Tiene cambios sin guardar. ¿Está seguro que desea continuar?'
    },
    DATA_LOSS_WARNING: {
        title: 'Advertencia de Pérdida de Datos',
        message: 'Esta acción eliminará información permanentemente y no se puede deshacer.'
    }
} as const;

// Hook for easy access to medical notifications
export const useMedicalNotifications = () => {
    const { showSuccess, showError, showWarning, showInfo } = useNotification();

    return {
        // Patient notifications
        notifyPatientCreated: () => showSuccess(
            MEDICAL_NOTIFICATIONS.PATIENT_CREATED.title,
            MEDICAL_NOTIFICATIONS.PATIENT_CREATED.message
        ),
        notifyPatientUpdated: () => showSuccess(
            MEDICAL_NOTIFICATIONS.PATIENT_UPDATED.title,
            MEDICAL_NOTIFICATIONS.PATIENT_UPDATED.message
        ),
        notifyPatientDeleted: () => showSuccess(
            MEDICAL_NOTIFICATIONS.PATIENT_DELETED.title,
            MEDICAL_NOTIFICATIONS.PATIENT_DELETED.message
        ),
        notifyPatientNotFound: () => showError(
            MEDICAL_NOTIFICATIONS.PATIENT_NOT_FOUND.title,
            MEDICAL_NOTIFICATIONS.PATIENT_NOT_FOUND.message
        ),
        notifyPatientSearchError: () => showError(
            MEDICAL_NOTIFICATIONS.PATIENT_SEARCH_ERROR.title,
            MEDICAL_NOTIFICATIONS.PATIENT_SEARCH_ERROR.message
        ),

        // Medical notes notifications
        notifyNoteAdded: () => showSuccess(
            MEDICAL_NOTIFICATIONS.NOTE_ADDED.title,
            MEDICAL_NOTIFICATIONS.NOTE_ADDED.message
        ),
        notifyNoteUpdated: () => showSuccess(
            MEDICAL_NOTIFICATIONS.NOTE_UPDATED.title,
            MEDICAL_NOTIFICATIONS.NOTE_UPDATED.message
        ),
        notifyNoteDeleted: () => showSuccess(
            MEDICAL_NOTIFICATIONS.NOTE_DELETED.title,
            MEDICAL_NOTIFICATIONS.NOTE_DELETED.message
        ),
        notifyNoteSaveError: () => showError(
            MEDICAL_NOTIFICATIONS.NOTE_SAVE_ERROR.title,
            MEDICAL_NOTIFICATIONS.NOTE_SAVE_ERROR.message
        ),

        // Form notifications
        notifyFormValidationError: () => showWarning(
            MEDICAL_NOTIFICATIONS.FORM_VALIDATION_ERROR.title,
            MEDICAL_NOTIFICATIONS.FORM_VALIDATION_ERROR.message
        ),
        notifyFormSaveError: () => showError(
            MEDICAL_NOTIFICATIONS.FORM_SAVE_ERROR.title,
            MEDICAL_NOTIFICATIONS.FORM_SAVE_ERROR.message
        ),

        // System notifications
        notifyNetworkError: () => showError(
            MEDICAL_NOTIFICATIONS.NETWORK_ERROR.title,
            MEDICAL_NOTIFICATIONS.NETWORK_ERROR.message
        ),
        notifyServerError: () => showError(
            MEDICAL_NOTIFICATIONS.SERVER_ERROR.title,
            MEDICAL_NOTIFICATIONS.SERVER_ERROR.message
        ),
        notifyUnauthorizedError: () => showError(
            MEDICAL_NOTIFICATIONS.UNAUTHORIZED_ERROR.title,
            MEDICAL_NOTIFICATIONS.UNAUTHORIZED_ERROR.message
        ),

        // Success notifications
        notifyDataSaved: () => showSuccess(
            MEDICAL_NOTIFICATIONS.DATA_SAVED.title,
            MEDICAL_NOTIFICATIONS.DATA_SAVED.message
        ),
        notifyOperationSuccess: () => showSuccess(
            MEDICAL_NOTIFICATIONS.OPERATION_SUCCESS.title,
            MEDICAL_NOTIFICATIONS.OPERATION_SUCCESS.message
        ),

        // Warning notifications
        notifyUnsavedChanges: () => showWarning(
            MEDICAL_NOTIFICATIONS.UNSAVED_CHANGES.title,
            MEDICAL_NOTIFICATIONS.UNSAVED_CHANGES.message
        ),
        notifyDataLossWarning: () => showWarning(
            MEDICAL_NOTIFICATIONS.DATA_LOSS_WARNING.title,
            MEDICAL_NOTIFICATIONS.DATA_LOSS_WARNING.message
        ),

        // Generic notifications with custom messages
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
};

// Utility function to handle API errors and show appropriate notifications
export const handleApiError = (error: unknown, showError: (title: string, message?: string) => void) => {
    console.error('API Error:', error);

    // Type guard to check if error has the expected structure
    const isApiError = (err: unknown): err is { response?: { status?: number; data?: { message?: string } }; code?: string; message?: string } => {
        return typeof err === 'object' && err !== null;
    };

    if (isApiError(error)) {
        if (error.response?.status === 401) {
            showError(
                MEDICAL_NOTIFICATIONS.UNAUTHORIZED_ERROR.title,
                MEDICAL_NOTIFICATIONS.UNAUTHORIZED_ERROR.message
            );
        } else if (error.response?.status && error.response.status >= 500) {
            showError(
                MEDICAL_NOTIFICATIONS.SERVER_ERROR.title,
                MEDICAL_NOTIFICATIONS.SERVER_ERROR.message
            );
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
            showError(
                MEDICAL_NOTIFICATIONS.NETWORK_ERROR.title,
                MEDICAL_NOTIFICATIONS.NETWORK_ERROR.message
            );
        } else {
            showError(
                'Error',
                error.response?.data?.message || error.message || 'Ocurrió un error inesperado'
            );
        }
    } else {
        showError(
            'Error',
            'Ocurrió un error inesperado'
        );
    }
};
