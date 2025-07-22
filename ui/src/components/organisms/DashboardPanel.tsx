import React from 'react';
import { Card, Typography, Button } from '../atoms';
import { StatsCard } from '../molecules';
import { usePatients } from '../../hooks/usePatients';
import { statsApi } from '../../lib/api/patients';
import { useQuery } from '@tanstack/react-query';
import { Users, UserPlus, Activity } from 'lucide-react';

interface DashboardPanelProps {
    onCreatePatient?: () => void;
    onViewAllPatients?: () => void;
    onViewRecentVisits?: () => void;
}

export const DashboardPanel: React.FC<DashboardPanelProps> = ({
    onCreatePatient,
    onViewAllPatients,
}) => {
    // Fetch dashboard statistics
    const { data: statsData } = useQuery({
        queryKey: ['stats'],
        queryFn: () => statsApi.getStats(),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    // Fetch recent patients for quick overview
    const { data: recentPatientsData, isLoading: patientsLoading } = usePatients({
        limit: 5,
        offset: 0
    });

    const quickActions = [
        {
            label: 'Nuevo Paciente',
            icon: <UserPlus className="w-4 h-4" />,
            onClick: onCreatePatient,
            variant: 'primary' as const,
        },
        {
            label: 'Ver Todos los Pacientes',
            icon: <Users className="w-4 h-4" />,
            onClick: onViewAllPatients,
            variant: 'outline' as const,
        },
    ];

    const getGenderDistribution = () => {
        if (!statsData) return { male: 0, female: 0, children: 0 };
        return {
            male: statsData.male || 0,
            female: statsData.female || 0,
            children: statsData.children || 0,
        };
    };

    const genderDistribution = getGenderDistribution();

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <Card className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Typography variant="h2" className="mb-2">
                            Panel de Control
                        </Typography>
                        <Typography variant="body" className="text-muted-foreground">
                            Resumen general de la clínica médica
                        </Typography>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Activity className="w-8 h-8 text-primary" />
                    </div>
                </div>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Pacientes"
                    value={statsData?.total || 0}
                    icon={<Users className="w-6 h-6" />}
                    trend={statsData?.recentVisits ? {
                        value: statsData.recentVisits,
                        isPositive: true,
                        label: "visitas recientes"
                    } : undefined}
                    color="blue"
                />

                <StatsCard
                    title="Pacientes Masculinos"
                    value={genderDistribution.male}
                    icon={<Users className="w-6 h-6" />}
                    color="green"
                />

                <StatsCard
                    title="Pacientes Femeninos"
                    value={genderDistribution.female}
                    icon={<Users className="w-6 h-6" />}
                    color="red"
                />

                <StatsCard
                    title="Niños/as"
                    value={genderDistribution.children}
                    icon={<Users className="w-6 h-6" />}
                    color="yellow"
                />
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
                <Typography variant="h3" className="mb-4">
                    Acciones Rápidas
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                        <Button
                            key={index}
                            variant={action.variant}
                            onClick={action.onClick}
                            className="justify-start h-auto p-4"
                        >
                            <div className="flex items-center space-x-3">
                                {action.icon}
                                <div className="text-left">
                                    <div className="font-medium">{action.label}</div>
                                    <div className="text-sm opacity-70 mt-1">
                                        {action.label === 'Nuevo Paciente' && 'Registrar un nuevo paciente'}
                                        {action.label === 'Ver Todos los Pacientes' && 'Explorar lista completa'}
                                    </div>
                                </div>
                            </div>
                        </Button>
                    ))}
                </div>
            </Card>

            {/* Recent Patients Overview */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <Typography variant="h3">
                        Pacientes Recientes
                    </Typography>
                    {onViewAllPatients && (
                        <Button variant="ghost" size="sm" onClick={onViewAllPatients}>
                            Ver todos
                        </Button>
                    )}
                </div>

                {patientsLoading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !recentPatientsData?.patients.length ? (
                    <div className="text-center py-8">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <Typography variant="body" className="text-muted-foreground mb-2">
                            No hay pacientes registrados
                        </Typography>
                        <Typography variant="bodySmall" className="text-muted-foreground mb-4">
                            Comienza agregando tu primer paciente
                        </Typography>
                        {onCreatePatient && (
                            <Button onClick={onCreatePatient} size="sm">
                                Agregar Primer Paciente
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentPatientsData.patients.slice(0, 5).map((patient) => (
                            <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg border transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Typography variant="label" className="text-primary font-semibold">
                                            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body" className="font-medium">
                                            {patient.firstName} {patient.lastName}
                                        </Typography>
                                        <Typography variant="bodySmall" className="text-muted-foreground">
                                            {patient.age} años • {patient.phone}
                                        </Typography>
                                    </div>
                                </div>
                                <Typography variant="caption" className="text-muted-foreground">
                                    {new Date(patient.visitDate).toLocaleDateString('es-GT', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </Typography>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Additional Statistics */}
            {statsData && (
                <Card className="p-6">
                    <Typography variant="h3" className="mb-4">
                        Estadísticas Adicionales
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Typography variant="label" className="text-muted-foreground mb-2 block">
                                Edad Promedio
                            </Typography>
                            <Typography variant="h2" className="text-primary">
                                {statsData.averageAge?.toFixed(1) || '0'} años
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="label" className="text-muted-foreground mb-2 block">
                                Visitas Últimos 30 Días
                            </Typography>
                            <Typography variant="h2" className="text-primary">
                                {statsData.recentVisits || 0}
                            </Typography>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};
