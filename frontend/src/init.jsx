import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { StrictMode } from 'react';

import authReducer from './store/authSlice.js';
import chatReducer from './store/chatSlice.js';
import { chatApi } from './store/chatApi.js';
import { initProfanity } from './services/profanityFilter.js';
import ruTranslations from './locales/ru.json';
import App from './App.jsx';

const resources = {
  ru: {
    translation: ruTranslations.translation,
  },
};

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

const init = async (socket) => {
  initProfanity();

  await i18n
    .init({
      resources,
      lng: 'ru',
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });

  const store = configureStore({
    reducer: {
      auth: authReducer,
      chat: chatReducer,
      [chatApi.reducerPath]: chatApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(chatApi.middleware),
  });

  if (socket) {
    socket.on('newMessage', (payload) => {
      store.dispatch(chatApi.util.updateQueryData('getMessages', undefined, (draft) => {
        draft.push(payload);
      }));
    });
  }

  // Rollbar включаем только для продакшна

  const fallbackUI = () => (
    <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
      <h2>{i18n.t('errors.somethingWentWrong')}</h2>
      <p>{i18n.t('errors.workingOnIt')}</p>
      <button onClick={() => window.location.reload()}>{i18n.t('errors.reloadPage')}</button>
    </div>
  );

  const vdom = (
    <StrictMode>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary fallbackUI={fallbackUI}>
          <ReduxProvider store={store}>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </RollbarProvider>
    </StrictMode>
  );

  return vdom;
};

export default init;
