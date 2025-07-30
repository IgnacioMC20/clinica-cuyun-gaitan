import React, { useState } from 'react';
import { Button } from './atoms/Button';

const TestErrorComponent: React.FC = () => {
    const [shouldError, setShouldError] = useState(false);

    if (shouldError) {
        // This will trigger the error boundary
        throw new Error('Test error for ErrorBoundary testing');
    }

    return (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h3 className="text-red-800 font-semibold mb-2">Error Boundary Test</h3>
            <p className="text-red-600 text-sm mb-4">
                Click the button below to test the error boundary functionality.
            </p>
            <Button
                onClick={() => setShouldError(true)}
                variant="destructive"
                size="sm"
            >
                Trigger Error
            </Button>
        </div>
    );
};

export default TestErrorComponent;