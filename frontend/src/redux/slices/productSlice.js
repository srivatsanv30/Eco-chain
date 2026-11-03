import { createSlice } from '@reduxjs/toolkit';

const getStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
};

const savedFromStorage = getStorageItem('ecochain_saved');
const compareFromStorage = getStorageItem('ecochain_compare');

const productSlice = createSlice({
  name: 'products',
  initialState: {
    savedProducts: savedFromStorage,
    compareList: compareFromStorage, // max 4
    searchFilters: { brand: '', category: '', minPrice: '', maxPrice: '', ecoScore: '', sort: 'ecoScore', search: '' },
  },
  reducers: {
    toggleSaveProduct: (state, action) => {
      const product = action.payload;
      const idx = state.savedProducts.findIndex(p => p._id === product._id);
      if (idx >= 0) {
        state.savedProducts.splice(idx, 1);
      } else {
        state.savedProducts.push(product);
      }
      localStorage.setItem('ecochain_saved', JSON.stringify(state.savedProducts));
    },
    toggleCompareProduct: (state, action) => {
      const product = action.payload;
      const idx = state.compareList.findIndex(p => p._id === product._id);
      if (idx >= 0) {
        state.compareList.splice(idx, 1);
      } else if (state.compareList.length < 4) {
        state.compareList.push(product);
      }
      localStorage.setItem('ecochain_compare', JSON.stringify(state.compareList));
    },
    clearCompare: (state) => {
      state.compareList = [];
      localStorage.removeItem('ecochain_compare');
    },
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    resetFilters: (state) => {
      state.searchFilters = { brand: '', category: '', minPrice: '', maxPrice: '', ecoScore: '', sort: 'ecoScore', search: '' };
    },
  },
});

export const { toggleSaveProduct, toggleCompareProduct, clearCompare, setSearchFilters, resetFilters } = productSlice.actions;
export default productSlice.reducer;
