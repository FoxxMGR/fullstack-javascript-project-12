import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.items = action.payload;
    },
    addMessage: (state, action) => {
      state.items.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setMessages, addMessage, setLoading, setError } = messagesSlice.actions;
export default messagesSlice.reducer;