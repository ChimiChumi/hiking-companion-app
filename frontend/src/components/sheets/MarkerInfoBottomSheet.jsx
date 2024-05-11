import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Text, View, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';

import {getSelectedMarker, unselectMarker} from '../../../context/reducers/markerReducer';
import {closeSheet, getOpenedSheet, openSheet} from '../../../context/reducers/sheetReducer';
import {
  getRouteLineStrings,
  getRouteMarkers,
  getStatuses,
} from '../../../context/reducers/routeReducer';
import {getIsNavMode} from '../../../context/reducers/navigationReducer';

import {SHEETS, SHEET_ANIMATION} from '../../consts';
import {shouldKeepSheetOpen} from '../../utils/helpers';
import {findClosestIndex} from '../../utils/calculators';

import sheetStyles from '../../styles/sheetStyles';
import markerInfoStyles from '../../styles/markerInfoStyles';
import placeholder from '../../assets/placeholder.jpg';

const MarkerInfoBottomSheet = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const bottomSheetRef = useRef(null);

  const status = useSelector(getStatuses);
  const selectedMarker = useSelector(getSelectedMarker);
  const currentSheet = useSelector(getOpenedSheet);
  const isNavMode = useSelector(getIsNavMode);
  const markers = useSelector(getRouteMarkers);
  const lineStrings = useSelector(getRouteLineStrings);

  const [isOpen, setIsOpen] = useState(false);
  const [markerData, setMarkerData] = useState({
    title: '',
    altitude: '',
    image: null,
    description: '',
    hasImage: false,
    hasDescription: false,
  });

  // Update marker info data when selected marker changes
  useEffect(() => {
    if (status.routeFeatures === 'fulfilled' && selectedMarker !== null && !isEndpoint) {
      const marker = markers[selectedMarker];
      const closestIndex = findClosestIndex(
        lineStrings[0].geometry.coordinates,
        marker.geometry.coordinates,
      );

      setMarkerData({
        title: marker.properties.Title,
        altitude: lineStrings[0].elevation[closestIndex].toFixed(0) + ' m',
        image: placeholder,
        description: marker.properties.Description,
        hasImage: !!marker.properties.Image,
        hasDescription: !!marker.properties.Description,
      });
    }
  }, [selectedMarker, status.routeFeatures, isEndpoint]);

  let snapPoints;
  let dynamicSize = false;
  if (markerData.hasDescription || markerData.hasImage) {
    snapPoints = ['70%'];
    dynamicSize = true;
  } else {
    snapPoints = ['8%'];
  }

  const isEndpoint = useMemo(
    () => selectedMarker === 'start' || selectedMarker === 'end',
    [selectedMarker],
  );

  const openMarkerInfoSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
    setIsOpen(true);
  }, []);

  const closeSheetAndReset = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (currentSheet === SHEETS.MARKER_INFO && !isOpen) {
      openMarkerInfoSheet();
    } else if (currentSheet !== SHEETS.MARKER_INFO && isOpen) {
      if (isNavMode) {
        dispatch(openSheet(SHEETS.NAVIGATION));
      }
      closeSheetAndReset();
    }
  }, [currentSheet, isOpen, isNavMode]);

  const handleSheetChanges = useCallback(
    index => {
      if (index === -1) {
        if (!shouldKeepSheetOpen(currentSheet, SHEETS.MARKER_INFO)) {
          dispatch(closeSheet());
          dispatch(unselectMarker());
        }
        setIsOpen(false);
      }
    },
    [currentSheet, dispatch],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      style={sheetStyles.backgroundStyle}
      backgroundStyle={sheetStyles.backgroundStyle}
      handleIndicatorStyle={sheetStyles.handleStyle}
      enablePanDownToClose={true}
      animateOnMount={true}
      enableOverDrag={false}
      enableDynamicSizing={dynamicSize}
      animationConfigs={SHEET_ANIMATION}
      onChange={handleSheetChanges}>
      <BottomSheetView>
        <View style={markerInfoStyles.container}>
          <View style={markerInfoStyles.titleContainer}>
            <Text style={markerInfoStyles.title}>{markerData.title}</Text>
            <Text style={markerInfoStyles.altitudeLabel}>
              {t('label.altitude')}:{' '}
              <Text style={markerInfoStyles.altitude}>{markerData.altitude}</Text>
            </Text>
          </View>
          {markerData.hasImage || markerData.hasDescription ? (
            <View style={markerInfoStyles.gridContainer}>
              {markerData.hasImage && !markerData.hasDescription ? (
                <View style={markerInfoStyles.gridCellFullWidth}>
                  <Image
                    source={markerData.image}
                    style={markerInfoStyles.image}
                    resizeMode="cover"
                  />
                </View>
              ) : null}
              {markerData.hasDescription && !markerData.hasImage ? (
                <View style={markerInfoStyles.gridCellFullWidth}>
                  <Text style={markerInfoStyles.description}>{markerData.description}</Text>
                </View>
              ) : null}
              {markerData.hasImage && markerData.hasDescription && (
                <>
                  <View style={markerInfoStyles.gridCell}>
                    <Image
                      source={markerData.image}
                      style={markerInfoStyles.image}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={markerInfoStyles.gridCell}>
                    <Text style={markerInfoStyles.description}>{markerData.description}</Text>
                  </View>
                </>
              )}
            </View>
          ) : null}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default MarkerInfoBottomSheet;
