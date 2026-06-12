import { createSlice, createSelector } from '@reduxjs/toolkit';
import { chatApi } from './chatApi';

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

const selectChatState = (state) => state.chat;

export const chatSelectors = {
  selectCurrentChannelId: (state) => state.chat.currentChannelId,
  selectModal: (state) => state.chat.modal,
  selectCurrentChannel: createSelector(
    [chatApi.endpoints.getChannels.select(), selectChatState],
    (channelsResult, chat) => {
      const channels = channelsResult.data || [];
      return channels.find((ch) => ch.id === chat.currentChannelId) || null;
    },
  ),
  selectCurrentMessages: createSelector(
    [chatApi.endpoints.getMessages.select(), selectChatState],
    (messagesResult, chat) => {
      const messages = messagesResult.data || [];
      return messages.filter((msg) => msg.channelId === chat.currentChannelId);
    },
  ),
};
