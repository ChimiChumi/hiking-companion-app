import * as Localization from 'expo-localization';
import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { setLocale } from '../../context/reducers/utilReducer';

export const useInitializeLocale = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const locale = Localization.getLocales()[0].languageCode;
    dispatch(setLocale(locale));
  }, [dispatch]);
};
