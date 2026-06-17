import { createSlice } from '@reduxjs/toolkit';
import storage from '../services/storage';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storage.getUser(),
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
