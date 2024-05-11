import React, {useRef, useEffect, useCallback, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

import {closeSheet, getOpenedSheet} from '../../../context/reducers/sheetReducer';
import {setActiveCoordinate} from '../../../context/reducers/routeReducer';

import {SHEETS, SHEET_ANIMATION} from '../../consts';
import {shouldKeepSheetOpen} from '../../utils/helpers';

import ElevationGraph from '../smart/ElevationGraph';

import sheetStyles from '../../styles/sheetStyles';

const ChartBottomSheet = () => {
  const dispatch = useDispatch();
  const bottomSheetRef = useRef(null);

  const snapPoints = ['30%'];

  const currentSheet = useSelector(getOpenedSheet);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (currentSheet === SHEETS.CHART && !isOpen) {
      bottomSheetRef.current?.snapToIndex(0);
      setIsOpen(true);
    } else if (currentSheet !== SHEETS.CHART && isOpen) {
      bottomSheetRef.current?.close();
      dispatch(setActiveCoordinate(null));
      setIsOpen(false);
    }
  }, [currentSheet]);

  const handleSheetChanges = useCallback(
    index => {
      if (index === -1) {
        if (!shouldKeepSheetOpen(currentSheet, SHEETS.CHART)) {
          dispatch(closeSheet());
        }
      }
    },
    [currentSheet, dispatch],
  );

  const sheetStyle = useMemo(() => [sheetStyles.backgroundStyle, {marginHorizontal: 9}], []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      style={sheetStyle}
      backgroundStyle={sheetStyles.backgroundStyle}
      handleIndicatorStyle={sheetStyles.handleStyle}
      enablePanDownToClose={true}
      animateOnMount={true}
      enableOverDrag={false}
      shouldMeasureHeight={true}
      enableDynamicSizing={true}
      animationConfigs={SHEET_ANIMATION}
      onChange={handleSheetChanges}>
      <BottomSheetView>
        <ElevationGraph />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ChartBottomSheet;
