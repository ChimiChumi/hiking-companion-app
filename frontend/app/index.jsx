import '../i18n';
import {useState, useEffect} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import auth from '@react-native-firebase/auth';

import store from '../context/store';
import {fetchAllRoutes, cacheAllFeatures} from '../context/reducers/routeReducer';

import useInitialURL from '../src/hooks/useInitialUrl';
import useScreenOrientation from '../src/hooks/useScreenOrientation';
import {useRequestLocationPermission} from '../src/hooks/useRequestLocationPermission';
import {useInitializeLocale} from '../src/hooks/useInitializeLocale';

import {checkNetworkStatus} from '../src/utils/helpers';

import {checkAndDownloadNewRoutes} from '../src/services/FirebaseService';
import {getSymbolsToStorage} from '../src/services/FileSystemService';

import Home from './home';

SplashScreen.preventAutoHideAsync();

const App = () => {
  SplashScreen.hideAsync();
  const dispatch = useDispatch();
  const [initilizing, setInitializing] = useState(true);
  const [fontsLoaded] = useFonts({
    Inter: require('../src/assets/fonts/inter-medium.ttf'),
  });

  useInitialURL();
  useScreenOrientation();
  useInitializeLocale();
  useRequestLocationPermission();

  const progressListener = (pack, status) => {
    console.log(`Progress: ${Math.floor(status.percentage)}%`);
  };

  useEffect(() => {
    const success = () => {
      console.log('User signed in anonymously');
      setInitializing(false);
    };

    const error = error => {
      if (error.code === 'auth/operation-not-allowed') {
        console.log('Enable anonymous in your firebase console.');
      }
      console.error(error);
    };

    checkNetworkStatus(dispatch);
    auth().signInAnonymously().then(success).catch(error);
    checkAndDownloadNewRoutes(progressListener);
    dispatch(cacheAllFeatures());
    dispatch(fetchAllRoutes());
    getSymbolsToStorage();
  }, []);

  if (initilizing) {
    return null;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <Home />
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
