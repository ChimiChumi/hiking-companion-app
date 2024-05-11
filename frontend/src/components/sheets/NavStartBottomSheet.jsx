import React, {useRef, useEffect, useCallback, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Card, Button} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import * as turf from '@turf/turf';
import * as Haptics from 'expo-haptics';

import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

import {closeSheet, getOpenedSheet} from '../../../context/reducers/sheetReducer';
import {
  getRouteLineStrings,
  getStatuses,
  getUserLocation,
} from '../../../context/reducers/routeReducer';
import {getSelectedEndpoint, unselectMarker} from '../../../context/reducers/markerReducer';

import {SHEETS, SHEET_ANIMATION} from '../../consts';
import {handleStartNavigation} from '../../utils/handlers';
import {calculateNavigationDetails} from '../../utils/calculators';
import {shouldKeepSheetOpen} from '../../utils/helpers';

import navStartStyles from '../../styles/navStartStyles';
import sheetStyles from '../../styles/sheetStyles';

const NavStartBottomSheet = ({mapLayoutRef}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const snapPoints = useMemo(() => ['13%'], []);
  const bottomSheetRef = useRef(null);

  const lineStrings = useSelector(getRouteLineStrings);
  const selectEndpoint = useSelector(getSelectedEndpoint);
  const currentSheet = useSelector(getOpenedSheet);
  const userLocation = useSelector(getUserLocation);
  const status = useSelector(getStatuses);

  const [timeData, setTimeData] = useState({hours: 0, minutes: 0});

  const coordinates = lineStrings.length > 0 ? lineStrings[0].geometry.coordinates : [];
  const altitudes = lineStrings.length > 0 ? lineStrings[0].elevation : null;

  // Dynamic trip duration estimations based on user location and selected endpoint
  const navigationDetails = useMemo(() => {
    let totalDistance = null;
    let line = null;
    let userPoint = null;
    let snapped = null;
    let isUserFar = false;

    line = turf.lineString(coordinates.map(coord => [coord[0], coord[1]]));
    totalDistance = turf.length(line, {units: 'kilometers'});

    if (userLocation) {
      totalDistance = turf.length(line, {units: 'kilometers'});
      userPoint = turf.point(userLocation);
      snapped = turf.nearestPointOnLine(line, userPoint, {units: 'kilometers'});
      isUserFar = snapped.properties.dist > totalDistance;
    }

    return calculateNavigationDetails(
      userPoint,
      selectEndpoint,
      coordinates,
      line,
      totalDistance,
      snapped,
      altitudes,
      4,
      isUserFar,
    );
  }, [selectEndpoint, userLocation, coordinates, altitudes]);

  useEffect(() => {
    if (status.routeFeatures === 'fulfilled') {
      setTimeData(navigationDetails.estimatedTime);
    }
  }, [navigationDetails, status.routeFeatures]);

  const {minutes, hours} = timeData;
  let durationString =
    hours > 0
      ? t('label.tripDuration', {hours, minutes})
      : t('label.tripDurationNoHours', {minutes});

  useEffect(() => {
    if (currentSheet === SHEETS.NAV_START) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [currentSheet]);

  const handleSheetChanges = useCallback(
    index => {
      if (index === -1) {
        if (currentSheet !== SHEETS.MARKER_INFO) {
          dispatch(unselectMarker());
        }
        if (!shouldKeepSheetOpen(currentSheet, SHEETS.NAV_START)) {
          dispatch(closeSheet());
        }
      }
    },
    [currentSheet, dispatch],
  );

  const handleOnPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleStartNavigation(dispatch, mapLayoutRef);
  };

  const startNavigationButton = (
    <Button
      icon="navigation"
      mode="elevated"
      buttonColor="green"
      textColor="white"
      onPress={() => handleOnPress()}>
      {t('label.startButton')}
    </Button>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      style={navStartStyles.sheet}
      backgroundStyle={navStartStyles.startSheet}
      handleIndicatorStyle={sheetStyles.handleStyleNone}
      enablePanDownToClose={true}
      animateOnMount={true}
      enableOverDrag={false}
      bottomInset={12}
      detached={true}
      animationConfigs={SHEET_ANIMATION}
      onChange={handleSheetChanges}>
      <BottomSheetView>
        <Card.Title
          title={t('label.startNavigation')}
          titleVariant={'titleMedium'}
          titleStyle={navStartStyles.title}
          subtitle={durationString}
          subtitleStyle={navStartStyles.body}
          subtitleVariant="bodyLarge"
          mode="elevated"
          elevation={5}
          style={navStartStyles.content}
          right={props => startNavigationButton}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default NavStartBottomSheet;
