import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearUser } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    api.dispatch(clearUser());
  }
  return result;
};

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQueryWithReauth,
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
    }),
    addChannel: builder.mutation({
      query: (name) => ({
        url: '/channels',
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Channels'],
    }),
    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `/channels/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: ['Channels'],
    }),
    deleteChannel: builder.mutation({
      query: (id) => ({
        url: `/channels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Channels', 'Messages'],
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
