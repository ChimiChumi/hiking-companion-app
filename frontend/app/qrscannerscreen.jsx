import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator, Text, SafeAreaView, ToastAndroid} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {throttle} from 'lodash';
import {useTranslation} from 'react-i18next';

import * as Haptics from 'expo-haptics';
import {CameraView} from 'expo-camera/next';
import {useRouter} from 'expo-router';

import {getCameraPermission, getIsConnected} from '../context/reducers/utilReducer';

import {
  cacheAllFeatures,
  fetchAllRoutes,
  getAllFeatures,
  getAllRoutes,
  getStatuses,
  setBounds,
  unselectRoute,
} from '../context/reducers/routeReducer';

import PermissionLayout from '../src/components/dumb/PermissionLayout';

import cameraStyles from '../src/styles/cameraStyles';
import {SCREEN_WIDTH} from '../src/consts';
import {useRequestCameraPermission} from '../src/hooks/useRequestCameraPermission';
import {handleRouteSelection} from '../src/utils/handlers';

const QrScannerScreen = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const allRoutes = useSelector(getAllRoutes);
  const allFeatures = useSelector(getAllFeatures);
  const status = useSelector(getStatuses);
  const network = useSelector(getIsConnected);
  const cameraPermission = useSelector(getCameraPermission);

  const [scanned, setScanned] = useState(false);
  const [validResult, setValidResult] = useState(false);
  const [viewHeight, setViewHeight] = useState(0);

  const isValidFirestoreId = id => /^[a-zA-Z0-9]{20}$/.test(id);

  useRequestCameraPermission();

  useEffect(() => {
    if (!scanned && network) {
      dispatch(fetchAllRoutes());
      dispatch(cacheAllFeatures());
    }
  }, [network]);

  useEffect(() => {
    if (scanned && validResult && status.routeFeatures === 'fulfilled') {
      router.back();
      setScanned(false);
    }
  }, [validResult, status.routeFeatures]);

  const showError = throttle(
    () => {
      ToastAndroid.showWithGravityAndOffset(
        t('QR.noResult'),
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        500,
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setValidResult(false);
    },
    3000,
    {leading: true, trailing: false},
  );

  const handleBarcodeScanned = scanningResult => {
    if (scanned) return;
    setScanned(true);

    const {boundingBox, data} = scanningResult;
    const size = boundingBox.size;
    if (size.width < 70) {
      setScanned(false);
      return;
    }

    const origin = boundingBox.origin;
    const centerPoint = {
      x: viewHeight / 2 - origin.x,
      y: SCREEN_WIDTH / 2 - origin.y,
    };

    if (centerPoint.x > 85 || centerPoint.x < 30 || centerPoint.y > 55 || centerPoint.y < 30) {
      setScanned(false);
      return;
    }

    // add future validation for hashes
    // if (!isValidFirestoreId(data)) {
    //   showError();
    //   setScanned(false);
    //   return;
    // }

    const route = allRoutes.find(r => r.name === data);
    if (!route) {
      showError();
      setScanned(false);
      return;
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setValidResult(true);
      dispatch(unselectRoute());
      dispatch(setBounds(route.bounds));
      handleRouteSelection(dispatch, route.key, allFeatures);
    }
  };

  const getDimension = event => {
    const {height} = event.nativeEvent.layout;
    setViewHeight(height);
  };

  if (!cameraPermission) {
    return <PermissionLayout text={t('permission.noCamera')} />;
  }

  return (
    <SafeAreaView style={cameraStyles.container}>
      {!validResult ? (
        <>
          <View style={{flex: 1, position: 'relative'}} onLayout={getDimension}>
            <CameraView
              facing={'back'}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              style={cameraStyles.camera}
            />
          </View>
          <View style={cameraStyles.reticle} />
        </>
      ) : (
        <>
          <View style={cameraStyles.centeredView}>
            <ActivityIndicator style={cameraStyles.spinner} size="large" color="white" />
            <Text style={cameraStyles.text}>{t('QR.loading')}</Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default QrScannerScreen;
