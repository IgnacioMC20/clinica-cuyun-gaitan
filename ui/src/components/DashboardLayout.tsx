import React from 'react';
import { cn } from '@/lib/utils';
import { UserMenu } from './auth/UserMenu';

interface DashboardLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
    return (
        <div className={cn("min-h-screen bg-hospitalBlue", className)}>
            {/* Header */}
            <header className="bg-hospitalWhite shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Clínica Médica Cuyún Gaitán
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-hospitalWhite shadow-sm min-h-screen">
                    <nav className="mt-8 px-4">
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/tablero"
                                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-accentBlue hover:text-white transition-colors"
                                >
                                    <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                    </svg>
                                    Tablero
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/pacientes"
                                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-accentBlue hover:text-white transition-colors"
                                >
                                    <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                    Pacientes
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}