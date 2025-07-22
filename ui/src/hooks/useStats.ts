import { useState, useEffect, useCallback } from 'react';
import { PatientStats } from '../../../shared/types';
import { statsApi, ApiError } from '../lib/api/patients';

// Hook for fetching patient statistics
export function useStats() {
    const [data, setData] = useState<PatientStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await statsApi.getStats();
            setData(result);
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'Failed to fetch statistics';
            setError(errorMessage);
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Refresh statistics
    const refresh = useCallback(() => {
        fetchStats();
    }, [fetchStats]);

    // Initial fetch
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        data,
        loading,
        error,
        refresh,
    };
}

export default useStats;