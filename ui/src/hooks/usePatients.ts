import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientsApi } from '../lib/api/patients';
import type {
    PatientResponse,
    CreatePatientRequest,
    UpdatePatientRequest,
    PatientSearchParams
} from '../../../shared/types/patient';

// Query Keys
export const patientKeys = {
    all: ['patients'] as const,
    lists: () => [...patientKeys.all, 'list'] as const,
    list: (filters: PatientSearchParams) => [...patientKeys.lists(), { filters }] as const,
    details: () => [...patientKeys.all, 'detail'] as const,
    detail: (id: string) => [...patientKeys.details(), id] as const,
};

// Fetch all patients with search support
export const usePatients = (searchParams: Partial<PatientSearchParams> = {}) => {
    return useQuery({
        queryKey: patientKeys.list(searchParams),
        queryFn: () => patientsApi.getPatients(searchParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Fetch single patient
export const usePatient = (id: string) => {
    return useQuery({
        queryKey: patientKeys.detail(id),
        queryFn: () => patientsApi.getPatient(id),
        enabled: !!id,
    });
};

// Create patient mutation
export const useCreatePatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePatientRequest) => patientsApi.createPatient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
        },
        onError: (error) => {
            console.error('Error creating patient:', error);
        },
    });
};

// Update patient mutation
export const useUpdatePatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<UpdatePatientRequest> }) =>
            patientsApi.updatePatient(id, data),
        onSuccess: (updatedPatient: PatientResponse) => {
            queryClient.setQueryData(
                patientKeys.detail(updatedPatient.id),
                updatedPatient
            );
            queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
        },
        onError: (error) => {
            console.error('Error updating patient:', error);
        },
    });
};

// Delete patient mutation
export const useDeletePatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => patientsApi.deletePatient(id),
        onSuccess: (_, deletedId) => {
            queryClient.removeQueries({ queryKey: patientKeys.detail(deletedId) });
            queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
        },
        onError: (error) => {
            console.error('Error deleting patient:', error);
        },
    });
};

// Add note to patient mutation
export const useAddPatientNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, note }: { id: string; note: { title: string; content: string } }) =>
            patientsApi.addNote(id, note),
        onSuccess: (updatedPatient: PatientResponse) => {
            queryClient.setQueryData(
                patientKeys.detail(updatedPatient.id),
                updatedPatient
            );
        },
        onError: (error) => {
            console.error('Error adding note:', error);
        },
    });
};

// Update note from patient mutation
export const useUpdatePatientNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ patientId, noteId, note }: { patientId: string; noteId: string; note: { title: string; content: string } }) =>
            patientsApi.updateNote(patientId, noteId, note),
        onSuccess: (updatedPatient: PatientResponse) => {
            queryClient.setQueryData(
                patientKeys.detail(updatedPatient.id),
                updatedPatient
            );
        },
        onError: (error) => {
            console.error('Error updating note:', error);
        },
    });
};

// Delete note from patient mutation
export const useDeletePatientNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ patientId, noteId }: { patientId: string; noteId: string }) =>
            patientsApi.deleteNote(patientId, noteId),
        onSuccess: (updatedPatient: PatientResponse) => {
            queryClient.setQueryData(
                patientKeys.detail(updatedPatient.id),
                updatedPatient
            );
        },
        onError: (error) => {
            console.error('Error deleting note:', error);
        },
    });
};

// Search patient by phone
export const useSearchPatientByPhone = (phone: string) => {
    return useQuery({
        queryKey: ['patients', 'search', 'phone', phone],
        queryFn: () => patientsApi.searchByPhone(phone),
        enabled: !!phone && phone.length >= 8,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};
