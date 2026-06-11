import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    currentChannelId: null,
    modal: { isOpen: false, type: null, channelId: null },
  },
  reducers: {
    setCurrentChannel: (state, action) => { state.currentChannelId = action.payload; },
    openModal: (state, action) => { state.modal = { isOpen: true, type: action.payload.type, channelId: action.payload.channelId || null }; },
    closeModal: (state) => { state.modal = { isOpen: false, type: null, channelId: null }; },
  },
});

export const { setCurrentChannel, openModal, closeModal } = chatSlice.actions;
export default chatSlice.reducer;
