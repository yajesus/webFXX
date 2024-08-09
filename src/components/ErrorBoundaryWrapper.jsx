import React from "react";
import { ErrorBoundary } from "react-error-boundary";

// Fallback component for rendering when an error occurs
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div role="alert">
        <h2 className="text-3xl font-bold text-red-600">
          Something went wrong:
        </h2>
        <pre className="mt-4 text-lg">{error.message}</pre>
        <button
          onClick={resetErrorBoundary}
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// Main Error Boundary Wrapper
const ErrorBoundaryWrapper = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app here
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
