import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReduxProvider } from 'react-redux';
import { StrictMode } from 'react';
import Rollbar from 'rollbar';

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

  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
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

  socket.on('newMessage', (payload) => {
    store.dispatch(chatApi.util.updateQueryData('getMessages', undefined, (draft) => {
      draft.push(payload);
    }));
  });

  // Rollbar включаем только для продакшна
  new Rollbar(rollbarConfig);

  const vdom = (
    <StrictMode>
      <ReduxProvider store={store}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </ReduxProvider>
    </StrictMode>
  );

  return vdom;
};

export default init;
