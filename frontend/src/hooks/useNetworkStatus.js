import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { setIsConnected } from '../../context/reducers/utilReducer';

export const useNetworkStatus = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleConnectivityChange = (state) => {
      dispatch(setIsConnected(state.isConnected));
    };

    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    return () => unsubscribe();
  }, [dispatch]);
};
