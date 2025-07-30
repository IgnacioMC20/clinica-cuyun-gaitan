import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Badge, Spinner } from '../components/atoms';
import { SearchInput, PatientCard } from '../components/molecules';
import { usePatients } from '../hooks/usePatients';
import { useMedicalNotifications } from '../lib/utils/notifications';
import type { PatientResponse } from '../../../shared/types/patient';
import { GENDER_LABELS } from '../../../shared/types/patient';
import {
    Users,
    Plus,
    Filter,
    SortAsc,
    SortDesc,
    Search,
    X,
    ArrowLeft
} from 'lucide-react';

type SortField = 'name' | 'age' | 'visitDate' | 'phone';
type SortOrder = 'asc' | 'desc';
type GenderFilter = 'all' | 'male' | 'female' | 'child';

interface FilterState {
    search: string;
    gender: GenderFilter;
    ageRange: {
        min: number;
        max: number;
    };
    sortField: SortField;
    sortOrder: SortOrder;
}

const initialFilters: FilterState = {
    search: '',
    gender: 'all',
    ageRange: {
        min: 0,
        max: 150
    },
    sortField: 'name',
    sortOrder: 'asc'
};

export const AllPatientsPage: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [showFilters, setShowFilters] = useState(false);

    const { data: patientsData = [], isLoading, error } = usePatients();
    const { notifyPatientSearchError } = useMedicalNotifications();

    // Extract patients array from the response
    const patients = Array.isArray(patientsData) ? patientsData : patientsData.patients || [];

    // Filter and sort patients
    const filteredAndSortedPatients = useMemo(() => {
        const filtered = patients.filter((patient: PatientResponse) => {
            // Search filter
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch = !searchTerm ||
                patient.firstName.toLowerCase().includes(searchTerm) ||
                patient.lastName.toLowerCase().includes(searchTerm) ||
                patient.phone.includes(searchTerm) ||
                patient.address.toLowerCase().includes(searchTerm);

            // Gender filter
            const matchesGender = filters.gender === 'all' || patient.gender === filters.gender;

            // Age range filter
            const matchesAge = patient.age >= filters.ageRange.min && patient.age <= filters.ageRange.max;

            return matchesSearch && matchesGender && matchesAge;
        });

        // Sort patients
        filtered.sort((a: PatientResponse, b: PatientResponse) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (filters.sortField) {
                case 'name':
                    aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
                    bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
                    break;
                case 'age':
                    aValue = a.age;
                    bValue = b.age;
                    break;
                case 'visitDate':
                    aValue = new Date(a.visitDate).getTime();
                    bValue = new Date(b.visitDate).getTime();
                    break;
                case 'phone':
                    aValue = a.phone;
                    bValue = b.phone;
                    break;
                default:
                    aValue = a.firstName.toLowerCase();
                    bValue = b.firstName.toLowerCase();
            }

            if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [patients, filters]);

    const handleFilterChange = (key: keyof FilterState, value: string | number | GenderFilter | { min: number; max: number }) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSortChange = (field: SortField) => {
        setFilters(prev => ({
            ...prev,
            sortField: field,
            sortOrder: prev.sortField === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
        }));
    };

    const clearFilters = () => {
        setFilters(initialFilters);
    };

    const handlePatientClick = (patient: PatientResponse) => {
        navigate(`/paciente/${patient.id}`);
    };

    if (error) {
        notifyPatientSearchError();
    }

    const activeFiltersCount = [
        filters.search,
        filters.gender !== 'all',
        filters.ageRange.min > 0 || filters.ageRange.max < 150
    ].filter(Boolean).length;

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
                                    onClick={() => navigate('/tablero')}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Volver</span>
                                </Button>
                                <div>
                                    <Typography variant="h1" className="text-gray-900">
                                        Todos los Pacientes
                                    </Typography>
                                    <Typography variant="body" className="text-gray-600 mt-2">
                                        {filteredAndSortedPatients.length} de {patients.length} pacientes registrados
                                    </Typography>
                                </div>
                            </div>
                            <Link to="/paciente/nuevo">
                                <Button className="flex items-center space-x-2">
                                    <Plus className="w-4 h-4" />
                                    <span>Nuevo Paciente</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Search and Filters */}
                <Card className="mb-6">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            {/* Search */}
                            <div className="flex-1 max-w-md">
                                <SearchInput
                                    onSearch={(value: string) => handleFilterChange('search', value)}
                                    placeholder="Buscar por nombre, teléfono o dirección..."
                                    className="w-full"
                                    initialValue={filters.search}
                                />
                            </div>

                            {/* Filter Controls */}
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center space-x-2"
                                >
                                    <Filter className="w-4 h-4" />
                                    <span>Filtros</span>
                                    {activeFiltersCount > 0 && (
                                        <Badge variant="info" className="ml-1">
                                            {activeFiltersCount}
                                        </Badge>
                                    )}
                                </Button>

                                {activeFiltersCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        onClick={clearFilters}
                                        className="flex items-center space-x-2 text-gray-500"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Limpiar</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Gender Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Género
                                        </label>
                                        <select
                                            value={filters.gender}
                                            onChange={(e) => handleFilterChange('gender', e.target.value as GenderFilter)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medicalBlue-500"
                                        >
                                            <option value="all">Todos</option>
                                            <option value="male">{GENDER_LABELS.male}</option>
                                            <option value="female">{GENDER_LABELS.female}</option>
                                            <option value="child">{GENDER_LABELS.child}</option>
                                        </select>
                                    </div>

                                    {/* Age Range */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Edad Mínima
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="150"
                                            value={filters.ageRange.min}
                                            onChange={(e) => handleFilterChange('ageRange', {
                                                ...filters.ageRange,
                                                min: parseInt(e.target.value) || 0
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medicalBlue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Edad Máxima
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="150"
                                            value={filters.ageRange.max}
                                            onChange={(e) => handleFilterChange('ageRange', {
                                                ...filters.ageRange,
                                                max: parseInt(e.target.value) || 150
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medicalBlue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Sort Controls */}
                <div className="flex items-center justify-between mb-6">
                    <Typography variant="h3" className="text-gray-900">
                        Lista de Pacientes
                    </Typography>

                    <div className="flex items-center space-x-2">
                        <Typography variant="body" className="text-gray-500 mr-3">
                            Ordenar por:
                        </Typography>

                        {(['name', 'age', 'visitDate', 'phone'] as SortField[]).map((field) => {
                            const isActive = filters.sortField === field;
                            const labels = {
                                name: 'Nombre',
                                age: 'Edad',
                                visitDate: 'Fecha',
                                phone: 'Teléfono'
                            };

                            return (
                                <Button
                                    key={field}
                                    variant={isActive ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleSortChange(field)}
                                    className="flex items-center space-x-1"
                                >
                                    <span>{labels[field]}</span>
                                    {isActive && (
                                        filters.sortOrder === 'asc' ?
                                            <SortAsc className="w-3 h-3" /> :
                                            <SortDesc className="w-3 h-3" />
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                        <Typography variant="body" className="ml-3 text-gray-500">
                            Cargando pacientes...
                        </Typography>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Card className="p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <Search className="w-12 h-12 mx-auto" />
                        </div>
                        <Typography variant="h3" className="text-gray-900 mb-2">
                            Error al cargar pacientes
                        </Typography>
                        <Typography variant="body" className="text-gray-500">
                            No se pudieron cargar los pacientes. Intente nuevamente.
                        </Typography>
                    </Card>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredAndSortedPatients.length === 0 && patients.length === 0 && (
                    <Card className="p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <Users className="w-12 h-12 mx-auto" />
                        </div>
                        <Typography variant="h3" className="text-gray-900 mb-2">
                            No hay pacientes registrados
                        </Typography>
                        <Typography variant="body" className="text-gray-500 mb-6">
                            Comience agregando el primer paciente al sistema.
                        </Typography>
                        <Link to="/paciente/nuevo">
                            <Button className="flex items-center space-x-2 mx-auto">
                                <Plus className="w-4 h-4" />
                                <span>Agregar Primer Paciente</span>
                            </Button>
                        </Link>
                    </Card>
                )}

                {/* No Results State */}
                {!isLoading && !error && filteredAndSortedPatients.length === 0 && patients.length > 0 && (
                    <Card className="p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <Search className="w-12 h-12 mx-auto" />
                        </div>
                        <Typography variant="h3" className="text-gray-900 mb-2">
                            No se encontraron pacientes
                        </Typography>
                        <Typography variant="body" className="text-gray-500 mb-6">
                            Intente ajustar los filtros de búsqueda.
                        </Typography>
                        <Button variant="outline" onClick={clearFilters}>
                            Limpiar Filtros
                        </Button>
                    </Card>
                )}

                {/* Patients Grid */}
                {!isLoading && !error && filteredAndSortedPatients.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAndSortedPatients.map((patient) => (
                            <PatientCard
                                key={patient.id}
                                patient={patient}
                                onClick={() => handlePatientClick(patient)}
                                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
