import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import { store } from './store';
import './i18n';
import i18n from './i18n';

const t = i18n.t;

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.NODE_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  scrubFields: [
    'password',
    'token',
    'secret',
    'authorization',
    'cookie',
    'csrf_token',
  ],
};

const fallbackUI = () => (
  <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
    <h2>{t('errors.somethingWentWrong')}</h2>
    <p>{t('errors.workingOnIt')}</p>
    <button onClick={() => window.location.reload()}>{t('errors.reloadPage')}</button>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary fallbackUI={fallbackUI}>
        <ReduxProvider store={store}>
          <App />
        </ReduxProvider>
      </ErrorBoundary>
    </RollbarProvider>
  </StrictMode>
);