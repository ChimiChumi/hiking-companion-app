import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useDispatch } from 'react-redux';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
import { setLocationPermission } from '../../context/reducers/utilReducer';

export function useRequestLocationPermission() {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);

  const requestLocationPermission = () => {
    requestMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION]).then(statuses => {
      const fineLocationGranted = statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'granted';
      const coarseLocationGranted = statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === 'granted';
      const granted = fineLocationGranted && coarseLocationGranted;
      dispatch(setLocationPermission(granted));
    });
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active' && appState.current !== 'active') {
        requestLocationPermission();
      }
      appState.current = nextAppState;
    };

    requestLocationPermission();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [dispatch]);
}
