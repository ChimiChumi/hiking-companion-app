import { Dimensions } from "react-native";
import { useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';

export const deeplinkuri = "placeholder"

export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

export const StyleURL = {
  OUTDOORS_2D: 'mapbox://styles/chimichumi/clrxt5nw600t501qy3hr519oi',
  OUTDOORS_3D: 'mapbox://styles/chimichumi/clrxt09ot009y01phbvpra8sf',
  SATELLITE_2D: 'mapbox://styles/chimichumi/clrxt6vvi00a201ph1d0619p0',
  SATELLITE_3D: 'mapbox://styles/chimichumi/clrxsxxq6006501pned8a8dfj'
}

export const SHEETS = {
  MARKER_INFO: 'MARKER_INFO',
  SEARCH: 'SEARCH',
  CHART: 'CHART',
  NAVIGATION: 'NAVIGATION',
  NAV_START: 'NAV_START',
};

export const COLORS = {
  tint: '#f04d21',
  text: '#262626',
  grid: '#c5c5c9',
  indicator: '#5c2626',
};

export const SHEET_ANIMATION = useBottomSheetSpringConfigs({
  mass: 1,
  damping: 15,
  stiffness: 100,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
});

export const ASSETS = {
  twoD: require('./assets/icons/2D.png'),
  threeD: require('./assets/icons/3D.png'),
  altitude: require('./assets/icons/altitude.png'),
  clock: require('./assets/icons/clock.png'),
  close: require('./assets/icons/close.png'),
  compass: require('./assets/icons/compass.png'),
  distLeft: require('./assets/icons/distleft.png'),
  distTraveled: require('./assets/icons/disttraveled.png'),
  elevation: require('./assets/icons/elevation.png'),
  endpoint: require('./assets/icons/endpoint.png'),
  general: require('./assets/icons/general.png'),
  info: require('./assets/icons/info.png'),
  layer: require('./assets/icons/layer.png'),
  locate: require('./assets/icons/locate.png'),
  located: require('./assets/icons/located.png'),
  marker: require('./assets/icons/marker.png'),
  navigation: require('./assets/icons/navigation.png'),
  qr: require('./assets/icons/qr.png'),
  search: require('./assets/icons/search.png'),
  stop: require('./assets/icons/stop.png'),
  up: require('./assets/icons/up.png'),
  selection: require('./assets/icons/selection.png'),
};

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
