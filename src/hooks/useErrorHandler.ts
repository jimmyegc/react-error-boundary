import { useCallback, useState } from 'react';

export interface CustomError extends Error {
  componentName: string; // Dónde ocurrió (e.g., 'LoginForm')
  errorCode?: string;    // Código único para identificar el tipo de error
  context?: any; //Record<string, any>; // Información contextual relevante
}

interface UseErrorHandlerReturn {
  error: CustomError | null;
  createError: (
    message: string,
    componentName: string,
    context?: Record<string, any>,
    errorCode?: string
  ) => CustomError;
  throwError: (error: Error) => void;
}

const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<CustomError | null>(null);

  const throwError = useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);

  const createError = useCallback(
    (
      message: string,
      componentName: string,
      context?: Record<string, any>,
      errorCode?: string
    ): CustomError => {
      const error: CustomError = new Error(message) as CustomError;
      error.componentName = componentName;
      error.context = context;
      error.errorCode = errorCode;
      return error;
    },
    []
  );

  return { error, createError, throwError };
};

export default useErrorHandler;