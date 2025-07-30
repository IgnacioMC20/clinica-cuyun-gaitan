import React from 'react';
import { Spinner } from './atoms/Spinner';
import { Typography } from './atoms/Typography';

interface SplashScreenProps {
    isVisible: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
            <div className="text-center">
                {/* Clinic Logo */}
                <div className="mb-8">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </div>

                    {/* Clinic Name */}
                    <Typography variant="h1" className="text-blue-900 mb-2 font-bold">
                        Clínica Médica
                    </Typography>
                    <Typography variant="h2" className="text-blue-700 mb-6">
                        Cuyún Gaitán
                    </Typography>
                </div>

                {/* Loading Spinner */}
                <div className="mb-6">
                    <Spinner size="lg" className="mx-auto" />
                </div>

                {/* Loading Message */}
                <Typography variant="body" className="text-gray-600">
                    Cargando sistema médico...
                </Typography>

                {/* Professional tagline */}
                <Typography variant="caption" className="text-gray-500 mt-4">
                    Sistema de gestión médica profesional
                </Typography>
            </div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute top-1/4 -left-8 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-blue-150 rounded-full opacity-25 animate-pulse delay-500"></div>
            </div>
        </div>
    );
};

export default SplashScreen;