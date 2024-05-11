import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

const useScreenOrientation = () => {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const onChange = result => {
      setScreenWidth(result.window.width);
    };
    const setScreenOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };

    Dimensions.addEventListener('change', onChange);
    setScreenOrientation();

    return () => Dimensions.removeEventListener('change', onChange);
  }, []);

  return screenWidth;
};

export default useScreenOrientation;
