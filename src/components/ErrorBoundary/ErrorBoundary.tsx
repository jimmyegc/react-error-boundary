import React, { ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackRender: (props: {
    error: Error;
    errorInfo: React.ErrorInfo;
    resetErrorBoundary: () => void;
  }) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true, error, errorInfo });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    try {      
      const response = await fetch('https://nodejs-postgresql-api-render.onrender.com/report-error', {
      //const response = await fetch('http://localhost:3000/report-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error, additionalInfo: JSON.stringify(errorInfo) }),
      });
  
      if (!response.ok) {
        console.error('Error al reportar al servidor:', response.statusText);
      } else {
        console.log('Error reportado con éxito.');
      }
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError && this.state.error && this.state.errorInfo) {
      return this.props.fallbackRender({
        error: this.state.error,
        errorInfo: this.state.errorInfo,
        resetErrorBoundary: this.resetErrorBoundary,
      });
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
