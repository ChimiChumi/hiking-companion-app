import React, {useEffect, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Text} from 'react-native';

import {
  getIsNavMode,
  setTimeElapsed,
  getTimeElapsed,
} from '../../../context/reducers/navigationReducer';

import {formatTime} from '../../utils/formatters';
import {useTranslation} from 'react-i18next';

const Timer = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const isNavMode = useSelector(getIsNavMode);
  const elapsedTime = useSelector(getTimeElapsed);

  useEffect(() => {
    let interval;
    if (isNavMode) {
      const startTime = Date.now() - (elapsedTime || 0);
      interval = setInterval(() => {
        const newElapsedTime = Date.now() - startTime;
        dispatch(setTimeElapsed(newElapsedTime));
      }, 1000);
    } else {
      dispatch(setTimeElapsed(0));
    }
    return () => {
      clearInterval(interval);
    };
  }, [isNavMode, dispatch]);

  const formattedTime = useMemo(() => formatTime(elapsedTime, t), [elapsedTime]);

  return <Text>{formattedTime}</Text>;
};

export default Timer;
