import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useDerivedValue, runOnJS} from 'react-native-reanimated';
import {Circle, Line as SkiaLine, Text as SkiaText, useFont, vec} from '@shopify/react-native-skia';
import {debounce} from 'lodash';

import {setActiveCoordinate} from '../../../context/reducers/routeReducer';
import {getOpenedSheet} from '../../../context/reducers/sheetReducer';

import {COLORS as colors, SHEETS} from '../../consts';
import inter from '../../assets/fonts/inter-medium.ttf';

const ChartSlider = ({
  xPosition,
  yPosition,
  top,
  bottom,
  activeValue,
  activeIndex,
  lastPointRef,
  isActive,
  topOffset = 0,
  feature,
}) => {
  const FONT_SIZE = 16;
  const dispatch = useDispatch();
  const currentSheet = useSelector(getOpenedSheet);

  const font = useFont(inter, FONT_SIZE);
  const start = useDerivedValue(() => vec(xPosition.value, bottom));
  const end = useDerivedValue(() => vec(xPosition.value, top + 1.5 * FONT_SIZE + topOffset));

  // Slider info positions
  const activeValueDisplay = useDerivedValue(() => activeValue.value.toFixed(0) + ' m');
  const activeValueWidth = useDerivedValue(() => font?.getTextWidth(activeValueDisplay.value) || 0);
  const activeValueX = useDerivedValue(() => {
    let adjustment = 0;
    if (xPosition.value < 55) {
      adjustment = 20;
    } else if (xPosition.value > 300) {
      adjustment = -25;
    }
    return xPosition.value - activeValueWidth.value / 2 + adjustment;
  });

  const debouncedLogActiveValueIndex = useCallback(
    debounce(index => {
      dispatch(setActiveCoordinate(feature[0].geometry.coordinates[index]));
    }, 0),
    [dispatch],
  );

  // Fast elevation slider updates
  useDerivedValue(() => {
    if (isActive && activeIndex.value !== undefined) {
      runOnJS(debouncedLogActiveValueIndex)(activeIndex.value);
    }
  });

  useEffect(() => {
    if (currentSheet !== SHEETS.CHART) {
      lastPointRef.current = null;
    }
  }, [currentSheet]);

  if (isActive === true) {
    lastPointRef.current = [xPosition, yPosition];
  } else {
    if (lastPointRef.current === null) {
      return null;
    }
    xPosition = lastPointRef.current[0];
    yPosition = lastPointRef.current[1];
  }
  return (
    <>
      <SkiaLine p1={start} p2={end} color={colors.text} strokeWidth={1.5} />
      <Circle cx={xPosition} cy={yPosition} r={10} color={colors.indicator} />
      <Circle cx={xPosition} cy={yPosition} r={8} color="hsla(0, 0, 100%, 0.25)" />
      <SkiaText
        color={colors.text}
        font={font}
        text={activeValueDisplay}
        x={activeValueX}
        y={top + FONT_SIZE}
      />
    </>
  );
};

export default ChartSlider;
