import {
    PatientResponse,
    CreatePatientRequest,
    UpdatePatientRequest,
    PatientSearchParams,
    PatientSearchResponse,
    PatientStats
} from '../../../../shared/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// API Error class
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Generic API request function
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const { body, headers, ...rest } = options;

    const config: RequestInit = {
        ...rest,
        body,
        credentials: 'include', // Include cookies for session authentication
        headers: {
            ...headers,
            ...(body && !headers?.['Content-Type'] && {
                'Content-Type': 'application/json'
            })
        }
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(
                errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                response.status,
                errorData.details
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            error instanceof Error ? error.message : 'Network error occurred',
            0
        );
    }
}


// Patient API functions
export const patientsApi = {
    // Get all patients with search and pagination
    async getPatients(params: Partial<PatientSearchParams> = {}): Promise<PatientSearchResponse> {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        const endpoint = `/patients${queryString ? `?${queryString}` : ''}`;

        return apiRequest<PatientSearchResponse>(endpoint);
    },

    // Get single patient by ID
    async getPatient(id: string): Promise<PatientResponse> {
        return apiRequest<PatientResponse>(`/patients/${id}`);
    },

    // Create new patient
    async createPatient(patient: CreatePatientRequest): Promise<PatientResponse> {
        return apiRequest<PatientResponse>('/patients', {
            method: 'POST',
            body: JSON.stringify(patient),
        });
    },

    // Update existing patient
    async updatePatient(id: string, patient: Partial<UpdatePatientRequest>): Promise<PatientResponse> {
        return apiRequest<PatientResponse>(`/patients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(patient),
        });
    },

    // Delete patient
    async deletePatient(id: string): Promise<{ message: string; id: string }> {
        return apiRequest<{ message: string; id: string }>(`/patients/${id}`, {
            method: 'DELETE',
        });
    },

    // Add note to patient
    async addNote(id: string, note: { title: string; content: string }): Promise<PatientResponse> {
        return apiRequest<PatientResponse>(`/patients/${id}/notes`, {
            method: 'POST',
            body: JSON.stringify(note),
        });
    },

    // Update note from patient
    async updateNote(patientId: string, noteId: string, note: { title: string; content: string }): Promise<PatientResponse> {
        return apiRequest<PatientResponse>(`/patients/${patientId}/notes/${noteId}`, {
            method: 'PUT',
            body: JSON.stringify(note),
        });
    },

    // Delete note from patient
    async deleteNote(patientId: string, noteId: string): Promise<PatientResponse> {
        return apiRequest<PatientResponse>(`/patients/${patientId}/notes/${noteId}`, {
            method: 'DELETE',
        });
    },

    // Search patient by phone
    async searchByPhone(phone: string): Promise<PatientResponse> {
        return apiRequest<PatientResponse>(`/patients/search/phone/${encodeURIComponent(phone)}`);
    },
};

// Stats API functions
export const statsApi = {
    // Get patient statistics
    async getStats(): Promise<PatientStats> {
        return apiRequest<PatientStats>('/stats');
    },
};

// Export all APIs
export const api = {
    patients: patientsApi,
    stats: statsApi,
};

export default api;
