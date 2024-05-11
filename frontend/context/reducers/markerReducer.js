import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  selectedMarkerId: null,
  selectedEndpoint: null,
};

export const markersSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    unselectMarker(state) {
      state.selectedMarkerId = null;
    },
    unselectEndpoint(state) {
      state.selectedEndpoint = null;
    },
    setSelectedMarkerId: (state, action) => {
      state.selectedMarkerId = action.payload;
    },
    setEndpoint: (state, action) => {
      state.selectedEndpoint = action.payload;
    },
  },
});

export const getSelectedMarker = state => state.markers.selectedMarkerId;
export const getSelectedEndpoint = state => state.markers.selectedEndpoint;

export const { unselectMarker, unselectEndpoint, setSelectedMarkerId, setEndpoint } = markersSlice.actions;
export default markersSlice.reducer;
