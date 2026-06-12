import { createSlice } from '@reduxjs/toolkit';

const getUserFromStorage = () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  return token && username ? { token, username } : null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUserFromStorage(),
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
