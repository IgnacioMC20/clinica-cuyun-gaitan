import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/home';
import Patient from './pages/patient';
import RootLayout from './pages/Layout';
import NotFound from './pages/not-found';
import ErrorPage from './pages/error';

export const router = createBrowserRouter([
    {
        path: '',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/patient',
                element: <Patient />
            },
            {
                path: '/patient/:id',
                element: <Patient />
            },
            {
                path: '/patient/new',
                element: <Patient />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
])