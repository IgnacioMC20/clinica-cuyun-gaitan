import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { router } from './routes';
import { queryClient } from './lib/queryClient';
import { NotificationProvider } from './lib/contexts/NotificationContext';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
