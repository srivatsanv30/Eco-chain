import { createSlice } from '@reduxjs/toolkit';

const userFromStorage = localStorage.getItem('ecochain_user')
  ? JSON.parse(localStorage.getItem('ecochain_user'))
  : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.error = null;
      localStorage.setItem('ecochain_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('ecochain_user');
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
