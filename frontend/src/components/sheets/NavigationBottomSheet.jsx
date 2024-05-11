import {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';

import {closeSheet, getOpenedSheet} from '../../../context/reducers/sheetReducer';
import {
  getCurrentElevation,
  getDistanceLeft,
  getDistanceTraveled,
  getIsOnPath,
} from '../../../context/reducers/navigationReducer';

import {formatDistance} from '../../utils/formatters';
import {handleStopNavigation} from '../../utils/handlers';
import {ASSETS, SHEETS, SHEET_ANIMATION} from '../../consts';

import ActionButton from '../dumb/ActionButton';
import Timer from '../dumb/Timer';
import RowItem from '../dumb/RowItem';

import navigationStyles from '../../styles/navigationStyles';
import sheetStyles from '../../styles/sheetStyles';

const NavigationBottomSheet = ({mapLayoutRef}) => {
  const snapPoints = ['20%'];
  const {t} = useTranslation();

  const bottomSheetRef = useRef(null);
  const dispatch = useDispatch();
  const selectDistanceLeft = useSelector(getDistanceLeft);
  const selectDistanceTraveled = useSelector(getDistanceTraveled);
  const selectCurrentElevation = useSelector(getCurrentElevation);
  const selectisOnPath = useSelector(getIsOnPath);
  const currentSheet = useSelector(getOpenedSheet);

  const stopNavigationHandler = useCallback(() => {
    handleStopNavigation(dispatch, mapLayoutRef);
  }, [dispatch, mapLayoutRef]);

  const formattedDistanceLeft = useMemo(
    () => formatDistance(selectDistanceLeft),
    [selectDistanceLeft],
  );
  const formattedDistanceTraveled = useMemo(
    () => formatDistance(selectDistanceTraveled),
    [selectDistanceTraveled],
  );

  useEffect(() => {
    if (currentSheet === SHEETS.NAVIGATION) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [currentSheet]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      style={navigationStyles.sheet}
      backgroundStyle={navigationStyles.navSheet}
      handleIndicatorStyle={sheetStyles.handleStyleNone}
      enablePanDownToClose={false}
      animateOnMount={true}
      enableOverDrag={false}
      bottomInset={6}
      detached={true}
      animationConfigs={SHEET_ANIMATION}>
      <BottomSheetView>
        <View style={navigationStyles.container}>
          {selectisOnPath ? (
            <View style={navigationStyles.gridCellLeft}>
              <RowItem
                icon={ASSETS.clock}
                displayText={t('navigation.elapsedTime')}
                value={<Timer />}
              />
              <RowItem
                icon={ASSETS.distLeft}
                displayText={t('navigation.distanceLeft')}
                value={formattedDistanceLeft}
              />
              <RowItem
                icon={ASSETS.distTraveled}
                displayText={t('navigation.lengthTraveled')}
                value={formattedDistanceTraveled}
              />
              <RowItem
                icon={ASSETS.altitude}
                displayText={t('navigation.currentAltitude')}
                value={`${selectCurrentElevation} m`}
              />
            </View>
          ) : (
            <View style={navigationStyles.gridCellLeft}>
              <Text style={navigationStyles.offRoute}>{t('navigation.offRoute')}</Text>
            </View>
          )}

          <View style={navigationStyles.gridCellRight}>
            <ActionButton
              actionFunction={stopNavigationHandler}
              buttonStyle={navigationStyles.stop}
              imageSource={ASSETS.stop}
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default NavigationBottomSheet;
