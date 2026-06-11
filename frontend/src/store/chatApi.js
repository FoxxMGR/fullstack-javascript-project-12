import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import i18n from '../i18n';

const t = i18n.t;

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Channels', 'Messages'],
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '/channels',
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response.channels || [];
      },
      providesTags: ['Channels'],
    }),
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: ['Messages'],
    }),
    sendMessage: builder.mutation({
      query: ({ channelId, body, username }) => ({
        url: '/messages',
        method: 'POST',
        body: { channelId, body, username },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          toast.error(t('toasts.sendError'));
        }
      },
    }),
    addChannel: builder.mutation({
      query: (name) => ({
        url: '/channels',
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Channels'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(t('toasts.channelCreated'));
        } catch (err) {
          if (err?.error?.status === 409) toast.error(t('errors.channelExists'));
          else toast.error(t('toasts.networkError'));
        }
      },
    }),
    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `/channels/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: ['Channels'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(t('toasts.channelRenamed'));
        } catch (err) {
          if (err?.error?.status === 409) toast.error(t('errors.channelExists'));
          else toast.error(t('toasts.networkError'));
        }
      },
    }),
    deleteChannel: builder.mutation({
      query: (id) => ({
        url: `/channels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Channels', 'Messages'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(t('toasts.channelDeleted'));
        } catch {
          toast.error(t('toasts.networkError'));
        }
      },
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useAddChannelMutation,
  useRenameChannelMutation,
  useDeleteChannelMutation,
} = chatApi;
