import { createSlice } from '@reduxjs/toolkit';

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    items: [],
    currentChannelId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setChannels: (state, action) => {
      state.items = action.payload;
    },
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addChannel: (state, action) => {
      state.items.push(action.payload);
    },
    removeChannel: (state, action) => {
      state.items = state.items.filter(channel => channel.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setChannels, 
  setCurrentChannel, 
  addChannel, 
  removeChannel, 
  setLoading, 
  setError 
} = channelsSlice.actions;
export default channelsSlice.reducer;