import React from 'react';
import { getIcon } from '../utils/iconUtils';

// Safely get icons with fallbacks
let AlertTriangleIcon;
let RefreshCwIcon;
try {
  AlertTriangleIcon = getIcon('AlertTriangle') || (() => <span>⚠️</span>);
  RefreshCwIcon = getIcon('RefreshCw') || (() => <span>🔄</span>);
} catch (e) {
  AlertTriangleIcon = () => <span>⚠️</span>;
  RefreshCwIcon = () => <span>🔄</span>;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Attempt to reset child components if possible
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      // Safely render icons or fallbacks
      const ErrorIcon = AlertTriangleIcon || (() => <span>⚠️</span>);
      const ResetIcon = RefreshCwIcon || (() => <span>🔄</span>);
      
      // You can render any custom fallback UI
      return (
        <div className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-4">
              {React.createElement(ErrorIcon, { size: 32 })}
            </div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-surface-500 dark:text-surface-400 mb-4 max-w-md">
              An error occurred while rendering this component. Please try again or refresh the page.
            </p>
            {this.state.error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-4 text-left w-full max-w-md overflow-auto text-sm">
                <p className="font-mono text-red-700 dark:text-red-400">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <button onClick={this.handleReset} className="btn-primary flex items-center">
              {React.createElement(ResetIcon, { className: "h-4 w-4 mr-2" })}
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children || null;
  }
}

export default ErrorBoundary;