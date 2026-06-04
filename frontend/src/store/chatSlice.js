import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import io from 'socket.io-client';

// Конфигурация API
const api = axios.create();

// Интерсептор для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Асинхронный thunk для загрузки данных
export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Нет токена авторизации');
      }
      
      // ✅ Используем относительный путь
      const response = await api.get('/api/v1/channels');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки данных');
    }
  }
);

// Асинхронный thunk для отправки сообщения
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ channelId, body }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/messages', { channelId, body });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка отправки сообщения');
    }
  }
);

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  loading: false,
  sendingMessage: false,
  error: null,
  socket: null,
  socketConnected: false,
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
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchChatData
      .addCase(fetchChatData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload.channels || [];
        state.messages = action.payload.messages || [];
        // Выбираем канал general или первый доступный
        const generalChannel = state.channels.find(ch => ch.name === 'general');
        state.currentChannelId = generalChannel?.id || state.channels[0]?.id || null;
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки данных';
      })
      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.sendingMessage = false;
        // Не добавляем сообщение здесь — оно придёт через WebSocket
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload || 'Ошибка отправки сообщения';
      });
  },
});

export const { setCurrentChannel, addMessage, setSocketConnected, clearError } = chatSlice.actions;
export default chatSlice.reducer;