import { configureStore } from '@reduxjs/toolkit';
import routeReducer from './reducers/routeReducer'
import markerReducer from './reducers/markerReducer';
import sheetReducer from './reducers/sheetReducer';
import navigationReducer from './reducers/navigationReducer';
import utilReducer from './reducers/utilReducer';

const store = configureStore({
  reducer: {
    routeFeatures: routeReducer,
    markers: markerReducer,
    sheet: sheetReducer,
    navigation: navigationReducer,
    utils: utilReducer,
  },
})


export default store;
