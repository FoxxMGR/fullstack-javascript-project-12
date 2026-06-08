import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import Rollbar from 'rollbar';
import i18n from '../i18n';

const rollbar = new Rollbar({
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT || 'development',
});

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Вспомогательная функция для получения перевода
const t = i18n.t;

// Загрузка данных
export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/channels');
      return response.data;
    } catch (error) {
      rollbar.error(t('errors.rollbarLoadError'), { 
        error: error.message, 
        url: '/api/v1/data'
      });
      if (!error.response) {
        toast.error(t('toasts.networkError'));
      }
      return rejectWithValue(error.response?.data?.message || t('errors.loadError'));
    }
  }
);

// Отправка сообщения
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ channelId, body }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/messages', { channelId, body });
      return response.data;
    } catch (error) {
      rollbar.error(t('errors.rollbarSendError'), { 
        error: error.message, 
        channelId,
        body: body.substring(0, 50) // только начало сообщения для безопасности
      });
      if (!error.response) {
        toast.error(t('toasts.networkError'));
      } else {
        toast.error(t('toasts.sendError'));
      }
      return rejectWithValue(error.response?.data?.message || t('errors.sendError'));
    }
  }
);

// Добавление канала
export const addChannel = createAsyncThunk(
  'chat/addChannel',
  async (name, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/channels', { name });
      toast.success(t('toasts.channelCreated'));
      return response.data;
    } catch (error) {
      rollbar.error(t('errors.rollbarAddChannelError'), { 
        error: error.message, 
        name 
      });
      if (!error.response) {
        toast.error(t('toasts.networkError'));
      } else if (error.response?.status === 409) {
        toast.error(t('errors.channelExists'));
      } else {
        toast.error(t('errors.channelExists'));
      }
      return rejectWithValue(error.response?.data?.message || t('errors.channelExists'));
    }
  }
);

// Переименование канала
export const renameChannel = createAsyncThunk(
  'chat/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/v1/channels/${id}`, { name });
      toast.success(t('toasts.channelRenamed'));
      return response.data;
    } catch (error) {
      rollbar.error(t('errors.rollbarRenameChannelError'), { 
        error: error.message, 
        id, 
        name 
      });
      if (!error.response) {
        toast.error(t('toasts.networkError'));
      } else if (error.response?.status === 409) {
        toast.error(t('errors.channelExists'));
      } else {
        toast.error(t('errors.channelExists'));
      }
      return rejectWithValue(error.response?.data?.message || t('errors.channelExists'));
    }
  }
);




// Удаление канала
export const deleteChannel = createAsyncThunk(
  'chat/deleteChannel',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/channels/${id}`);
      toast.success(t('toasts.channelDeleted'));
      return id;
    } catch (error) {
      rollbar.error(t('errors.rollbarDeleteChannelError'), { 
        error: error.message, 
        id 
      });
      if (!error.response) {
        toast.error(t('toasts.networkError'));
      } else {
        toast.error(t('errors.channelExists'));
      }
      return rejectWithValue(error.response?.data?.message || t('errors.channelExists'));
    }
  }
);

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  loading: false,
  sendingMessage: false,
  modal: {
    isOpen: false,
    type: null,
    channelId: null,
  },
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        channelId: action.payload.channelId || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        channelId: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchChatData
      .addCase(fetchChatData.pending, (state) => {
        state.loading = true;
      })
.addCase(fetchChatData.fulfilled, (state, action) => {
  state.loading = false;
  state.channels = action.payload.channels || [];
  state.messages = action.payload.messages || []
        
  if (state.channels.length > 0 && !state.currentChannelId) {
    const defaultChannel = state.channels.find(ch => ch.name === 'general');
    state.currentChannelId = defaultChannel?.id || state.channels[0]?.id;
  }
})
      .addCase(fetchChatData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.sendingMessage = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload;
      })
      // addChannel
      .addCase(addChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload);
        state.currentChannelId = action.payload.id;
        state.modal.isOpen = false;
      })
      // renameChannel
      .addCase(renameChannel.fulfilled, (state, action) => {
        const index = state.channels.findIndex(ch => ch.id === action.payload.id);
        if (index !== -1) {
          state.channels[index] = action.payload;
        }
        state.modal.isOpen = false;
      })
      // deleteChannel
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter(ch => ch.id !== action.payload);
        state.messages = state.messages.filter(msg => msg.channelId !== action.payload);
        if (state.currentChannelId === action.payload) {
          const defaultChannel = state.channels.find(ch => ch.name === 'general');
          state.currentChannelId = defaultChannel?.id || state.channels[0]?.id;
        }
        state.modal.isOpen = false;
      });
  },
});

export const { setCurrentChannel, addMessage, openModal, closeModal } = chatSlice.actions;
export default chatSlice.reducer;
