import {useCallback, useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, ActivityIndicator, Keyboard, Image} from 'react-native';
import {debounce} from 'lodash';
import {useTranslation} from 'react-i18next';
import * as turf from '@turf/turf';
import * as Haptics from 'expo-haptics';

import {Card} from 'react-native-paper';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';

import {
  setBounds,
  unselectRoute,
  getUserLocation,
  getAllRoutes,
  getStatuses,
  fetchAllRoutes,
  getAllFeatures,
  cacheAllFeatures,
} from '../../../context/reducers/routeReducer';
import {closeSheet, getOpenedSheet} from '../../../context/reducers/sheetReducer';

import {formatDistance} from '../../utils/formatters';
import {shouldKeepSheetOpen} from '../../utils/helpers';
import {ASSETS, SCREEN_WIDTH, SHEETS} from '../../consts';

import ActionButton from '../dumb/ActionButton';

import searchStyles from '../../styles/searchStyles';
import sheetStyles from '../../styles/sheetStyles';
import {getIsConnected} from '../../../context/reducers/utilReducer';
import {handleRouteSelection} from '../../utils/handlers';

const SearchBottomSheet = () => {
  const {t} = useTranslation();

  const snapPoints = SCREEN_WIDTH < 390 ? ['12%', '85%'] : ['10%', '85%'];

  const dispatch = useDispatch();
  const bottomSheetRef = useRef(null);

  const allRoutes = useSelector(getAllRoutes);
  const allFeatures = useSelector(getAllFeatures);
  const statuses = useSelector(getStatuses);

  const network = useSelector(getIsConnected);
  const currentSheet = useSelector(getOpenedSheet);
  const userLocation = useSelector(getUserLocation);

  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isProxy, setIsProxy] = useState(false);

  const checkNewRoutes = async () => {
    if (network) {
      setLoading(true);
      dispatch(fetchAllRoutes());
      dispatch(cacheAllFeatures());
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      (isOpen && statuses.allRoutes === 'fulfilled' && statuses.allFeatures === 'fulfilled') ||
      !network
    ) {
      setLoading(false);
      if (userLocation) {
        setIsProxy(true);
      } else {
        setIsProxy(false);
      }
    }
  }, [statuses, network]);

  const handleRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    checkNewRoutes();
    if (inputValue) {
      debouncedSearch(inputValue);
    }
  }, [dispatch, inputValue, debouncedSearch]);

  const debouncedSearch = useCallback(
    debounce(input => {
      if (input.length >= 3) {
        searchRoute(input);
      } else if (input.length === 0) {
        searchRoute(input);
      }
    }, 500),
    [allRoutes, isProxy],
  );

  useEffect(() => {
    debouncedSearch(inputValue);
  }, [inputValue, debouncedSearch]);

  const searchRoute = searchToken => {
    const searchTokenLower = searchToken.toLowerCase();

    if (isProxy) {
      const userPoint = turf.point(userLocation);
      const filteredResults = allRoutes.filter(
        route =>
          route.name.toLowerCase().includes(searchTokenLower) ||
          route.tags.some(tag => tag.toLowerCase().includes(searchTokenLower)),
      );

      const resultsWithDistance = filteredResults.map(route => {
        const bounds = route.bounds;
        const bbox = [
          Math.min(...bounds.map(b => b[0])),
          Math.min(...bounds.map(b => b[1])),
          Math.max(...bounds.map(b => b[0])),
          Math.max(...bounds.map(b => b[1])),
        ];
        const centroid = turf.centroid(turf.bboxPolygon(bbox));
        const distance = turf.distance(userPoint, centroid, {units: 'kilometers'});
        return {...route, distance};
      });

      resultsWithDistance.sort((a, b) => a.distance - b.distance);
      setAllResults(resultsWithDistance);
    } else {
      const filteredResults = allRoutes.filter(
        route =>
          route.name.toLowerCase().includes(searchTokenLower) ||
          route.tags.some(tag => tag.toLowerCase().includes(searchTokenLower)),
      );
      filteredResults.sort((a, b) => a.name.localeCompare(b.name));
      setAllResults(filteredResults);
    }
  };

  useEffect(() => {
    if (currentSheet === SHEETS.SEARCH && !isOpen) {
      bottomSheetRef.current?.snapToIndex(0);
      setIsOpen(true);
      handleRefresh();
    } else if (currentSheet !== SHEETS.SEARCH && isOpen) {
      bottomSheetRef.current?.close();
      setIsOpen(false);
    }
  }, [currentSheet, dispatch]);

  const handleSheetChanges = useCallback(
    index => {
      if (index === -1) {
        if (!shouldKeepSheetOpen(currentSheet, SHEETS.SEARCH)) {
          dispatch(closeSheet());
        }
        Keyboard.dismiss();
        setInputValue('');
      }
    },
    [currentSheet, dispatch],
  );

  const renderBackdrop = useCallback(
    props => <BottomSheetBackdrop {...props} disappearsOnIndex={0} appearsOnIndex={1} />,
    [],
  );

  const renderItem = useCallback(
    data => (
      <Card
        key={data.item.key}
        style={searchStyles.itemContainer}
        mode="elevated"
        elevation={0.5}
        theme={{roundness: 5, colors: {primary: 'black'}}}
        onPress={() => {
          dispatch(unselectRoute());
          dispatch(setBounds(data.item.bounds));
          handleRouteSelection(dispatch, data.item.key, allFeatures);

          Keyboard.dismiss();
          bottomSheetRef.current.close();
        }}>
        <Card.Title
          title={data.item.name}
          titleVariant={'titleLarge'}
          titleStyle={searchStyles.cardTitle}
          subtitle={'#' + data.item.tags.join(', ')}
          subtitleVariant={'bodyMedium'}
          subtitleStyle={searchStyles.cardSubtitle}
          right={props => (
            <>
              <Image
                source={ASSETS.distLeft}
                style={searchStyles.rightImage}
                resizeMode="contain"
              />
              <Text {...props} style={searchStyles.rightText}>
                {formatDistance(data.item.routeLength)}
              </Text>
            </>
          )}
          rightStyle={searchStyles.rightStyle}
        />
      </Card>
    ),
    [dispatch, allFeatures],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      style={sheetStyles.backgroundStyle}
      backgroundStyle={sheetStyles.backgroundStyle}
      handleIndicatorStyle={sheetStyles.handleStyle}
      enablePanDownToClose={true}
      keyboardBehavior="extend"
      animateOnMount={true}
      onChange={handleSheetChanges}>
      <View style={searchStyles.searchContainer}>
        <BottomSheetTextInput
          value={inputValue}
          onChangeText={setInputValue}
          contextMenuHidden={true}
          placeholder={t('search.placeholder')}
          onFocus={() => setInputValue('')}
          style={searchStyles.textInput}
        />
        <ActionButton
          imageSource={ASSETS.search}
          buttonStyle={searchStyles.searchButton}
          actionFunction={() => handleRefresh(inputValue.trim())}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="black" style={searchStyles.noResultsContainer} />
      ) : allResults.length > 0 ? (
        <BottomSheetFlatList
          data={allResults}
          keyExtractor={item => item.key}
          renderItem={renderItem}
          contentContainerStyle={searchStyles.contentContainer}
          keyboardShouldPersistTaps="handled"
          onRefresh={handleRefresh}
          refreshing={false}
        />
      ) : (
        <View style={searchStyles.noResultsContainer}>
          <Text style={searchStyles.noResultsText}>{t('search.noResults')}</Text>
        </View>
      )}
    </BottomSheet>
  );
};

export default SearchBottomSheet;
