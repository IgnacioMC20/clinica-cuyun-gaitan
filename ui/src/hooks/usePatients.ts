import { useState, useEffect, useCallback } from 'react';
import {
    PatientResponse,
    PatientSearchParams,
    PatientSearchResponse,
    CreatePatientRequest,
    UpdatePatientRequest
} from '../../../shared/types';
import { patientsApi, ApiError } from '../lib/api/patients';

// Hook for fetching patients with search and pagination
export function usePatients(initialParams: Partial<PatientSearchParams> = {}) {
    const [data, setData] = useState<PatientSearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<Partial<PatientSearchParams>>(initialParams);

    const fetchPatients = useCallback(async (searchParams?: Partial<PatientSearchParams>) => {
        setLoading(true);
        setError(null);

        try {
            const finalParams = searchParams || params;
            const result = await patientsApi.getPatients(finalParams);
            setData(result);
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch patients';
            setError(errorMessage);
            console.error('Error fetching patients:', err);
        } finally {
            setLoading(false);
        }
    }, [params]);

    // Update search parameters and refetch
    const updateParams = useCallback((newParams: Partial<PatientSearchParams>) => {
        setParams(prev => ({ ...prev, ...newParams }));
    }, []);

    // Refresh with current parameters
    const refresh = useCallback(() => {
        fetchPatients();
    }, [fetchPatients]);

    // Initial fetch
    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    return {
        data,
        loading,
        error,
        params,
        updateParams,
        refresh,
        fetchPatients,
    };
}

// Hook for fetching a single patient
export function usePatient(id: string | null) {
    const [data, setData] = useState<PatientResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPatient = useCallback(async (patientId: string) => {
        setLoading(true);
        setError(null);

        try {
            const result = await patientsApi.getPatient(patientId);
            setData(result);
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch patient';
            setError(errorMessage);
            console.error('Error fetching patient:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchPatient(id);
        } else {
            setData(null);
            setError(null);
        }
    }, [id, fetchPatient]);

    const refresh = useCallback(() => {
        if (id) {
            fetchPatient(id);
        }
    }, [id, fetchPatient]);

    return {
        data,
        loading,
        error,
        refresh,
    };
}

// Hook for patient mutations (create, update, delete)
export function usePatientMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createPatient = useCallback(async (patient: CreatePatientRequest): Promise<PatientResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await patientsApi.createPatient(patient);
            return result;
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'Failed to create patient';
            setError(errorMessage);
            console.error('Error creating patient:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePatient = useCallback(async (
        id: string,
        patient: Partial<UpdatePatientRequest>
    ): Promise<PatientResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await patientsApi.updatePatient(id, patient);
            return result;
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'Failed to update patient';
            setError(errorMessage);
            console.error('Error updating patient:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deletePatient = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await patientsApi.deletePatient(id);
            return true;
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'Failed to delete patient';
            setError(errorMessage);
            console.error('Error deleting patient:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const addNote = useCallback(async (
        id: string,
        note: { title: string; content: string }
    ): Promise<PatientResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await patientsApi.addNote(id, note);
            return result;
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'Failed to add note';
            setError(errorMessage);
            console.error('Error adding note:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const searchByPhone = useCallback(async (phone: string): Promise<PatientResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await patientsApi.searchByPhone(phone);
            return result;
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'Patient not found';
            setError(errorMessage);
            console.error('Error searching by phone:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        loading,
        error,
        createPatient,
        updatePatient,
        deletePatient,
        addNote,
        searchByPhone,
        clearError,
    };
}