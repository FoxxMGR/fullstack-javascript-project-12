import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Асинхронный запрос на сервер
export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Нет токена авторизации');
      }
      
      const response = await axios.get('/api/v1/channels', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data; // Ожидаемая структура: { channels, messages }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки данных');
    }
  }
);

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload.channels || [];
        state.messages = action.payload.messages || [];
        // Устанавливаем первый канал как текущий, если есть каналы
        if (state.channels.length > 0 && !state.currentChannelId) {
          state.currentChannelId = state.channels[0].id;
        }
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки данных';
      });
  },
});

export const { setCurrentChannel, clearError } = chatSlice.actions;
export default chatSlice.reducer;