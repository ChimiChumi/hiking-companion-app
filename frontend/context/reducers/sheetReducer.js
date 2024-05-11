import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  currentSheet: null,
};

export const sheetSlice = createSlice({
  name: 'sheet',
  initialState,
  reducers: {
    closeSheet(state) {
      Object.assign(state, initialState);
    },
    openSheet: (state, action) => {
      state.currentSheet = action.payload;
    },
  },
});

export const getOpenedSheet = state => state.sheet.currentSheet;

export const { closeSheet, openSheet } = sheetSlice.actions;
export default sheetSlice.reducer;
