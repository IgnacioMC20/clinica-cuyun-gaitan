import { createBrowserRouter } from 'react-router-dom';
import { DashboardPage, PatientDetailPage, NewPatientPage, AllPatientsPage } from './pages';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <DashboardPage />
    },
    {
        path: '/patients',
        element: <AllPatientsPage />
    },
    {
        path: '/patient/new',
        element: <NewPatientPage />
    },
    {
        path: '/patient/:id',
        element: <PatientDetailPage />
    }
]);
