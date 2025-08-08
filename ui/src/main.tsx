import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from './components/ErrorBoundary'
import SplashScreen from './components/SplashScreen'

const AppWithSplash: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('initializing app...');
      // Minimum splash screen time for better UX
      const minSplashTime = 1500; // 1.5 seconds
      const startTime = Date.now();

      try {
        // Simulate app initialization
        // Here you could add:
        // - Authentication checks
        // - Initial data loading
        // - API connectivity verification
        await new Promise(resolve => setTimeout(resolve, 500));

        setIsAppReady(true);

        // Ensure minimum splash time has passed
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minSplashTime - elapsedTime);

        setTimeout(() => {
          setShowSplash(false);
        }, remainingTime);

      } catch (error) {
        console.error('App initialization failed:', error);
        // Still hide splash screen even if initialization fails
        // The ErrorBoundary will handle any critical errors
        setIsAppReady(true);
        setShowSplash(false);
      }
    };

    initializeApp();
  }, []);

  return (
    <>
      <SplashScreen isVisible={showSplash} />
      {isAppReady && (
        <HelmetProvider>
          <ThemeProvider defaultTheme="light" storageKey="clinic-ui-theme">
            <App />
          </ThemeProvider>
        </HelmetProvider>
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppWithSplash />
    </ErrorBoundary>
  </React.StrictMode>,
)
