import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx'
import ErrorTemplate from './components/ErrorTemplate/ErrorTemplate.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
    
      fallbackRender={({ error, errorInfo, resetErrorBoundary }) =>  (
        <ErrorTemplate 
          error={error} 
          errorInfo={errorInfo}
          onRetry={resetErrorBoundary} 
          supportLink=""
        />
      )}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
