import {useState, useRef, useEffect} from 'react';
import {Button} from 'react-native-paper';
import {View, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {useTranslation} from 'react-i18next';
import {changeLanguage} from 'i18next';

import {getStatuses} from '../context/reducers/routeReducer';
import {getSelectedMarker} from '../context/reducers/markerReducer';
import {getOpenedSheet, openSheet} from '../context/reducers/sheetReducer';
import {getIsNavMode} from '../context/reducers/navigationReducer';
import {getLocale, getLocationPermission} from '../context/reducers/utilReducer';

import {ASSETS, SHEETS} from '../src/consts';

import {getNavigationButtonImage} from '../src/utils/helpers';
import {handleUnselectRoute, handleToggleMap3DMode} from '../src/utils/handlers';

import ActionButton from '../src/components/dumb/ActionButton';
import MapLayout from '../src/components/smart/MapLayout';
import SearchBottomSheet from '../src/components/sheets/SearchBottomSheet';
import ChartBottomSheet from '../src/components/sheets/ChartBottomSheet';
import MarkerInfoBottomSheet from '../src/components/sheets/MarkerInfoBottomSheet';
import NavigationBottomSheet from '../src/components/sheets/NavigationBottomSheet';
import NavStartBottomSheet from '../src/components/sheets/NavStartBottomSheet';
import LoadingSpinner from '../src/components/dumb/LoadingSpinner';

import styles from '../src/styles/styles';
import buttonStyles from '../src/styles/buttonStyles';

const Home = () => {
  const {t} = useTranslation();
  const mapLayoutRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const statuses = useSelector(getStatuses);
  const selectedMarkerId = useSelector(getSelectedMarker);
  const currentSheet = useSelector(getOpenedSheet);
  const selectIsNavMode = useSelector(getIsNavMode);
  const locale = useSelector(getLocale);
  const locationGranted = useSelector(getLocationPermission);

  const [isLoading, setLoading] = useState(true);
  const [isMap3D, setIsMap3D] = useState(false);
  const [barStyle, setBarStyle] = useState('dark');
  const [isViewPortTouched, setIsViewPortTouched] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);

  const loadingCondition = !isMapReady || isLoading;

  useEffect(() => {
    if (locationGranted) {
      setLoading(false);
    }
  }, [locationGranted]);

  useEffect(() => {
    getNavigationButtonImage(selectIsNavMode, isViewPortTouched);
    changeLanguage(locale);
  }, [selectIsNavMode, locale]);

  const onViewPortTouched = touched => {
    if (isViewPortTouched !== touched) {
      setIsViewPortTouched(touched);
    }
  };

  const handleMapStyleChange = () => {
    mapLayoutRef.current?.toggleMapStyle();
    const newBarStyle = barStyle === 'light' ? 'dark' : 'light';
    setBarStyle(newBarStyle);
  };

  return (
    <>
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar animated={true} style={barStyle} />
        <MapLayout
          ref={mapLayoutRef}
          setIsMapReady={setIsMapReady}
          isLoading={isLoading}
          isSearchVisible={currentSheet === SHEETS.SEARCH}
          onViewPortTouched={onViewPortTouched}
        />

        {statuses.routeFeatures === 'pending' && <LoadingSpinner status={statuses} />}
        <SearchBottomSheet />
        {statuses.routeFeatures === 'fulfilled' && (
          <>
            <ChartBottomSheet />
            <MarkerInfoBottomSheet />
            <NavigationBottomSheet mapLayoutRef={mapLayoutRef} />
            <NavStartBottomSheet mapLayoutRef={mapLayoutRef} />
          </>
        )}

        {!loadingCondition && (
          <>
            <View style={styles.buttonContainer}>
              {!selectIsNavMode && !currentSheet && (
                <>
                  {/* <ActionButton
                    imageSource={ASSETS.info}
                    actionFunction={() => {}}
                    buttonStyle={buttonStyles.infoButton}
                  /> */}
                  <ActionButton
                    imageSource={ASSETS.qr}
                    actionFunction={() => {
                      router.push('/qrscannerscreen');
                    }}
                    buttonStyle={buttonStyles.qrButton}
                  />
                </>
              )}

              {currentSheet !== SHEETS.SEARCH && (
                <>
                  <ActionButton
                    imageSource={isMap3D ? ASSETS.twoD : ASSETS.threeD}
                    actionFunction={() => handleToggleMap3DMode(mapLayoutRef, isMap3D, setIsMap3D)}
                    buttonStyle={buttonStyles.toggle3DButton}
                  />
                  <ActionButton
                    imageSource={ASSETS.layer}
                    actionFunction={() => handleMapStyleChange()}
                    buttonStyle={buttonStyles.layerButton}
                  />
                </>
              )}

              {(currentSheet === null || currentSheet === SHEETS.NAVIGATION) && (
                <ActionButton
                  imageSource={getNavigationButtonImage(selectIsNavMode, isViewPortTouched)}
                  actionFunction={() => mapLayoutRef.current?.goToUserLocation()}
                  buttonStyle={[
                    buttonStyles.locateButton,
                    currentSheet === SHEETS.CHART ? {opacity: 0} : {},
                  ]}
                />
              )}

              {!selectIsNavMode && currentSheet !== SHEETS.SEARCH && !currentSheet && (
                <ActionButton
                  imageSource={ASSETS.search}
                  actionFunction={() => dispatch(openSheet(SHEETS.SEARCH))}
                  buttonStyle={[
                    buttonStyles.searchButton,
                    currentSheet === SHEETS.CHART ? {opacity: 0} : {},
                  ]}
                />
              )}
            </View>
            {statuses.routeFeatures === 'fulfilled' && !selectIsNavMode && !currentSheet && (
              <View style={styles.backButton}>
                <Button
                  mode="elevated"
                  icon="arrow-left-bold"
                  textColor="black"
                  buttonColor="white"
                  iconStyle={{color: 'black'}}
                  style={{borderWidth: 1, borderColor: 'black'}}
                  onPress={() =>
                    handleUnselectRoute(dispatch, mapLayoutRef.current?.goToUserLocation)
                  }>
                  {t('label.backButton')}
                </Button>
              </View>
            )}

            {!selectIsNavMode &&
              !currentSheet &&
              !selectedMarkerId &&
              statuses.routeFeatures === 'fulfilled' && (
                <View style={styles.bottomButtonContainer}>
                  <TouchableOpacity
                    style={styles.chevronContainer}
                    onPress={() => dispatch(openSheet(SHEETS.CHART))}>
                    <Image source={ASSETS.up} style={buttonStyles.chevronButton} />
                  </TouchableOpacity>
                </View>
              )}
          </>
        )}
      </SafeAreaView>
    </>
  );
};

export default Home;
