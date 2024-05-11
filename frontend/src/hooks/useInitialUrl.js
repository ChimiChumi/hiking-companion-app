import { useState, useEffect } from 'react';
import { Linking } from 'react-native';

const useInitialURL = () => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      setUrl(initialUrl);
    };

    getUrlAsync();
  }, []);

  return url;
};

export default useInitialURL;
