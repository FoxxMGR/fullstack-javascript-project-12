import { createSlice } from '@reduxjs/toolkit';

const getUserFromStorage = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const { token, username } = JSON.parse(raw);
    return token && username ? { token, username } : null;
  } catch {
    return null;
  }
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
