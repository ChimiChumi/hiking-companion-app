import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getRoutes, saveToMemory } from '../../src/services/FirebaseService';
import { sanitizeBounds } from '../../src/utils/helpers';

export const initialState = {
  allRoutes: [],
  allFeatures: {},

  bounds: [],
  lineStrings: [],
  markers: [],
  polygons: [],
  routeLength: 0,

  activeCoordinate: null,
  userLocation: null,

  statuses: {
    allRoutes: 'idle', // 'idle', 'pending', 'fulfilled', 'rejected'
    allFeatures: 'idle',
    routeFeatures: 'idle',
  },
  errors: {
    allRoutes: null,
    allFeatures: null,
    routeFeatures: null,
  },
};

// Async thunks
export const cacheAllFeatures = createAsyncThunk('features/fetch', async () => {
  const response = await saveToMemory();
  return response;
});

export const fetchAllRoutes = createAsyncThunk('routes/fetch', async () => {
  const response = await getRoutes();

  const sanitizedRoutes = response.map(route => ({
    ...route,
    bounds: sanitizeBounds(route.bounds)
  }));

  return sanitizedRoutes;
});

// Slice
const routeFeaturesSlice = createSlice({
  name: 'routeFeatures',
  initialState,
  reducers: {
    unselectRoute(state) {
      return {
        ...initialState,
        allRoutes: state.allRoutes,
        allFeatures: state.allFeatures,
        userLocation: state.userLocation,
      };
    },
    setBounds(state, action) {
      state.bounds = action.payload;
    },
    setLineString(state, action) {
      state.lineStrings = action.payload;
    },
    setMarkers(state, action) {
      state.markers = action.payload;
    },
    setPolygons(state, action) {
      state.polygons = action.payload;
    },
    setRouteLoading(state) {
      state.statuses.routeFeatures = 'pending';
    },
    setRouteReady(state) {
      state.statuses.routeFeatures = 'fulfilled';
    },
    setActiveCoordinate(state, action) {
      state.activeCoordinate = action.payload;
    },
    setUserLocation(state, action) {
      state.userLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRoutes.pending, (state) => {
        state.statuses.allRoutes = 'pending';
      })
      .addCase(fetchAllRoutes.fulfilled, (state, action) => {
        state.allRoutes = action.payload;
        state.statuses.allRoutes = 'fulfilled';
      })
      .addCase(fetchAllRoutes.rejected, (state, action) => {
        state.errors.allRoutes = action.error.message;
        state.statuses.allRoutes = 'rejected';
      })

      .addCase(cacheAllFeatures.pending, (state) => {
        state.statuses.allFeatures = 'pending';
      })
      .addCase(cacheAllFeatures.fulfilled, (state, action) => {
        state.allFeatures = action.payload;
        state.statuses.allFeatures = 'fulfilled';
      })
      .addCase(cacheAllFeatures.rejected, (state, action) => {
        state.errors.allFeatures = action.error.message;
        state.statuses.allFeatures = 'rejected';
      })
  },
});

export const getAllRoutes = state => state.routeFeatures.allRoutes;
export const getAllFeatures = state => state.routeFeatures.allFeatures;

export const getRouteLineStrings = state => state.routeFeatures.lineStrings;
export const getRouteMarkers = state => state.routeFeatures.markers;
export const getRoutePolygons = state => state.routeFeatures.polygons;
export const getRouteBounds = state => state.routeFeatures.bounds;

export const getActiveCoordinate = state => state.routeFeatures.activeCoordinate;
export const getUserLocation = state => state.routeFeatures.userLocation;
export const getStatuses = state => state.routeFeatures.statuses;

export const {
  unselectRoute,
  setBounds,
  setLineString,
  setMarkers,
  setPolygons,
  setRouteLoading,
  setRouteReady,
  setActiveCoordinate,
  setUserLocation,
} = routeFeaturesSlice.actions;

export default routeFeaturesSlice.reducer;
