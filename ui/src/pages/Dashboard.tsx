import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatsCard } from '@/components/StatsCard';
import { PatientSearch } from '@/components/PatientSearch';
import { useStats } from '@/hooks/useStats';
import { usePatientMutations } from '@/hooks/usePatients';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export function Dashboard() {
  const navigate = useNavigate();
  const { data: stats, loading: statsLoading, error: statsError, refresh: refreshStats } = useStats();
  const { searchByPhone } = usePatientMutations();

  const handlePatientSelect = async (patient: any) => {
    // Navigate to patient detail page
    navigate(`/patient/${patient.id}`);
  };

  const handlePhoneSearch = async (phone: string) => {
    try {
      const patient = await searchByPhone(phone);
      if (patient) {
        navigate(`/patient/${patient.id}`);
      }
    } catch (error) {
      console.error('Phone search failed:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Resumen general de la clínica médica
          </p>
        </div>

        {/* Stats Grid */}
        {statsError && (
          <Alert className="mb-4">
            <AlertDescription>
              Error loading statistics: {statsError}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsLoading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-hospitalWhite p-6 rounded-lg shadow-sm">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))
          ) : (
            <>
              <StatsCard
                label="Total de Pacientes"
                value={stats?.total || 0}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />

              <StatsCard
                label="Pacientes Masculinos"
                value={stats?.male || 0}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              <StatsCard
                label="Pacientes Femeninos"
                value={stats?.female || 0}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              <StatsCard
                label="Pacientes Pediátricos"
                value={stats?.children || 0}
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 011.5 1.5V12a1.5 1.5 0 01-1.5 1.5H9m0-4.5V9a1.5 1.5 0 011.5-1.5H12a1.5 1.5 0 011.5 1.5v1.5m-6 0V12a1.5 1.5 0 001.5 1.5H9m-1.5-1.5V9a1.5 1.5 0 011.5-1.5H9" />
                  </svg>
                }
              />
            </>
          )}
        </div>

        {/* Patient Search Section */}
        <div className="bg-hospitalWhite rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Buscar Paciente
          </h2>
          <PatientSearch onPatientSelect={handlePatientSelect} />
        </div>

        {/* Recent Activity Section */}
        <div className="bg-hospitalWhite rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">María González</p>
                <p className="text-sm text-gray-500">Consulta general completada</p>
              </div>
              <span className="text-xs text-gray-400">Hace 2 horas</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Carlos Rodríguez</p>
                <p className="text-sm text-gray-500">Nuevo paciente registrado</p>
              </div>
              <span className="text-xs text-gray-400">Hace 4 horas</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">Ana Martínez</p>
                <p className="text-sm text-gray-500">Cita programada para mañana</p>
              </div>
              <span className="text-xs text-gray-400">Hace 6 horas</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}