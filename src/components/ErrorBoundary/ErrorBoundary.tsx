import React, { ReactNode } from 'react';
import './ErrorBoundary.css';
import { decodeErrorStack, extractMapUrl } from '../../utils/utils';
import { CustomError } from '../../hooks/useErrorHandler';

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

  async componentDidCatch(error: Error | CustomError, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true, error, errorInfo });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
      console.log("ERROR", error);
      const componentName = (error as CustomError).componentName;
      console.log("componentName", componentName);
      const context = (error as CustomError).context;
      console.log("context", context);
      const errorCode = (error as CustomError).errorCode;
      console.log("errorCode", errorCode);
      console.error("Original Stack Trace:", error.stack);
      console.log("ERROR INFO", errorInfo);

      const stack = error.stack || 'No stack trace';
      const mapUrl = extractMapUrl(stack);
      if (mapUrl) {
        try {   
        const decodedStack = await decodeErrorStack(stack, mapUrl);
        const newError = {           
          message: error.message,
          stack: decodedStack
        }
        const response = await fetch('https://nodejs-postgresql-api-render.onrender.com/report-error', {
          //const response = await fetch('http://localhost:3000/report-error', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: newError, additionalInfo: context }),
          });
      
          if (!response.ok) {
            console.error('Error al reportar al servidor:', response.statusText);
          } else {
            console.log('Error reportado con éxito.');
          }
        } catch (err) {
          console.error('Error al enviar la solicitud:', err);
        }

        //console.error('Error Decodificado:', decodedStack);
      }

      //const stackTrace = error.stack || 'No stack trace available';

      
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
