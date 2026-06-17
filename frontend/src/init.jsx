import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { StrictMode } from 'react';
import { toast } from 'react-toastify';

import authReducer from './store/authSlice.js';
import chatReducer, { setCurrentChannel } from './store/chatSlice.js';
import { chatApi } from './store/chatApi.js';
import { initProfanity } from './services/profanityFilter.js';
import logger from './services/logger.js';
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

  if (socket) {
    socket.on('newMessage', (payload) => {
      logger('newMessage', payload);
      store.dispatch(chatApi.util.updateQueryData('getMessages', undefined, (draft) => {
        draft.push(payload);
      }));
    });

    socket.on('newChannel', (channel) => {
      logger('newChannel', channel);
      store.dispatch(chatApi.util.updateQueryData('getChannels', undefined, (draft) => {
        if (!draft.some((ch) => ch.id === channel.id)) {
          draft.push(channel);
        }
      }));
    });

    socket.on('renameChannel', (channel) => {
      logger('renameChannel', channel);
      store.dispatch(chatApi.util.updateQueryData('getChannels', undefined, (draft) => {
        const idx = draft.findIndex((ch) => ch.id === channel.id);
        if (idx !== -1) draft[idx] = channel;
      }));
    });

    socket.on('removeChannel', ({ id }) => {
      logger('removeChannel', id);
      store.dispatch(chatApi.util.updateQueryData('getChannels', undefined, (draft) => {
        const idx = draft.findIndex((ch) => ch.id === id);
        if (idx !== -1) draft.splice(idx, 1);
      }));
      store.dispatch(chatApi.util.updateQueryData('getMessages', undefined, (draft) => {
        for (let i = draft.length - 1; i >= 0; i--) {
          if (draft[i].channelId === id) draft.splice(i, 1);
        }
      }));
      const currentChannelId = store.getState().chat.currentChannelId;
      if (currentChannelId === id) {
        store.dispatch(setCurrentChannel(null));
      }
    });

    socket.on('connect_error', () => {
      logger('connect_error');
      toast.error(i18n.t('toasts.websocketError'), { toastId: 'websocket-error' });
    });

    socket.on('disconnect', (reason) => {
      logger('disconnect', reason);
      if (reason !== 'io client disconnect') {
        toast.error(i18n.t('toasts.websocketError'), { toastId: 'websocket-error' });
      }
    });
  }

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
