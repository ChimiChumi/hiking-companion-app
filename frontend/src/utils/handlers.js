import { setLineString, setMarkers, setPolygons, setRouteLoading, setRouteReady, unselectRoute } from '../../context/reducers/routeReducer';
import { setEndpoint, setSelectedMarkerId, unselectEndpoint, unselectMarker } from '../../context/reducers/markerReducer';
import { closeSheet, openSheet } from '../../context/reducers/sheetReducer';
import { startNavigation, stopNavigation } from '../../context/reducers/navigationReducer';

import { SHEETS } from '../consts';
import { checkLocation, extractLineStrings, extractMarkers, extractPolygons } from './helpers';

export function handleRouteSelection(dispatch, routeId, dictionary) {
  const featureCollection = dictionary[routeId];
  if (!featureCollection) return;

  dispatch(setRouteLoading());

  setTimeout(() => {
    dispatch(setLineString(extractLineStrings(featureCollection.features)));
    dispatch(setMarkers(extractMarkers(featureCollection.features)));
    dispatch(setPolygons(extractPolygons(featureCollection.features)));
    dispatch(setRouteReady());
  }, 5);
}

export function handleUnselectRoute(dispatch, callback) {
  dispatch(unselectRoute());
  dispatch(unselectMarker());

  callback();
}

export function handleToggleMap3DMode(mapLayoutRef, isMap3D, setIsMap3D) {
  mapLayoutRef.current?.toggleDimension();
  setIsMap3D(!isMap3D);
}

export async function handleStartNavigation(dispatch, mapLayoutRef) {

  const isLocationEnabled = await checkLocation(() => { });
  if (!isLocationEnabled) {
    return;
  }

  dispatch(unselectMarker());
  dispatch(openSheet(SHEETS.NAVIGATION));
  setTimeout(() => {
    dispatch(startNavigation());
    mapLayoutRef.current?.goToUserLocation();
  }, 10);
}

export function handleStopNavigation(dispatch, mapLayoutRef) {
  dispatch(closeSheet());
  dispatch(unselectEndpoint());
  dispatch(unselectMarker());
  setTimeout(() => {
    dispatch(stopNavigation());
    mapLayoutRef.current?.goToUserLocation();
  }, 10);
}

const isEndpoint = (index) => index === 'start' || index === 'end';

const handleEndpointMarker = (dispatch, index) => {
  dispatch(openSheet(SHEETS.NAV_START));
  dispatch(setEndpoint(index));
  dispatch(setSelectedMarkerId(index));
}

const handleRegularMarker = (dispatch, index) => {
  dispatch(setSelectedMarkerId(index));
  dispatch(openSheet(SHEETS.MARKER_INFO));
};

export function handleMarkerPress(dispatch, index, isAnimating, isSelected, isNavMode) {
  if (isAnimating) {
    return;
  }

  if (isNavMode && isEndpoint(index)) {
    return;
  }

  if (isSelected) {
    dispatch(closeSheet());
    dispatch(unselectMarker());
    return;
  }

  if (isEndpoint(index)) {
    handleEndpointMarker(dispatch, index);
  } else {
    handleRegularMarker(dispatch, index);
  }
}
