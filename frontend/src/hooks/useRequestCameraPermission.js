import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useDispatch } from 'react-redux';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
import { setCameraPermission } from '../../context/reducers/utilReducer';

export function useRequestCameraPermission() {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);

  const requestCameraPermission = () => {
    requestMultiple([PERMISSIONS.ANDROID.CAMERA]).then(statuses => {
      const granted = statuses[PERMISSIONS.ANDROID.CAMERA] === 'granted';
      dispatch(setCameraPermission(granted));
    });
  }
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active' && appState.current !== 'active') {
        requestCameraPermission();
      }
      appState.current = nextAppState;
    };

    requestCameraPermission();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [dispatch]);
}
