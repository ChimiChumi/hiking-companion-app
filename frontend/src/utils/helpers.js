import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import { setIsConnected } from '../../context/reducers/utilReducer';

import { ASSETS, SHEETS } from '../consts';

export function getNavigationButtonImage(selectIsNavMode, isViewPortTouched) {
  if (selectIsNavMode) {
    return ASSETS.compass;
  }
  if (isViewPortTouched) {
    return ASSETS.locate;
  }
  return ASSETS.located;
};

export function generateLinearSequence(start, end, steps) {
  const sequence = [];
  const stepSize = (end - start) / (steps - 1);

  for (let i = 0; i < steps; i++) {
    sequence.push(start + stepSize * i);
  }

  return sequence;
}

export function shouldKeepSheetOpen(sheet, sheetToIgnore) {
  return sheet !== sheetToIgnore &&
    (sheet === SHEETS.CHART ||
      sheet === SHEETS.NAVIGATION ||
      sheet === SHEETS.MARKER_INFO ||
      sheet === SHEETS.NAV_START);
}

export async function checkLocation(callback) {
  const locationEnabled = await Location.hasServicesEnabledAsync();
  if (!locationEnabled) {
    try {
      await Location.getCurrentPositionAsync();
      setTimeout(() => {
        callback();
      }, 100);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return true;
  }
}

export function checkNetworkStatus(dispatch) {
  const handleConnectivityChange = (state) => {
    dispatch(setIsConnected(state.isConnected));
  };

  const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

  return unsubscribe;
}


function convertGeoPoint(geoPoint) {
  return [geoPoint.longitude, geoPoint.latitude];
}

export function sanitizeBounds(bounds) {
  return bounds.map(convertGeoPoint);
}

export function extractLineStrings(features) {
  return features.filter(feature => feature.geometry.type === 'LineString');
};

export function extractMarkers(features) {
  return features.filter(feature => feature.geometry.type === 'Point');
};

export function extractPolygons(features) {
  return features.filter(feature => feature.geometry.type === 'Polygon');
}
