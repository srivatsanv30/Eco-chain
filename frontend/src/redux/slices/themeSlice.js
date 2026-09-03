import { createSlice } from '@reduxjs/toolkit';

const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: localStorage.getItem('ecochain_theme') || getSystemTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('ecochain_theme', state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('ecochain_theme', action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
