import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Camera,
  MapView,
  setAccessToken,
  locationManager,
  UserTrackingMode,
  Viewport,
  LocationPuck,
  Images,
} from '@rnmapbox/maps';
import * as turf from '@turf/turf';
import {useTranslation} from 'react-i18next';

import {
  getRouteBounds,
  getRouteLineStrings,
  getStatuses,
  getUserLocation,
  setUserLocation,
} from '../../../context/reducers/routeReducer';

import {
  getIsNavMode,
  setCurrentElevation,
  setDistanceLeft,
  setDistanceTraveled,
  setIsOnPath,
} from '../../../context/reducers/navigationReducer';
import {getSelectedEndpoint} from '../../../context/reducers/markerReducer';
import {getLocationPermission} from '../../../context/reducers/utilReducer';

import {checkLocation} from '../../utils/helpers';
import {calculateNavigationDetails} from '../../utils/calculators';
import {ASSETS, StyleURL} from '../../consts';

import PathDrawer from './PathDrawer';
import NoPermissionError from '../dumb/PermissionLayout';
import LoadingSpinner from '../dumb/LoadingSpinner';

import styles from '../../styles/styles';

setAccessToken('MAPBOX_ACCESS_TOKEN');

const MapLayout = forwardRef(
  ({setIsMapReady, isLoading, isSearchVisible, onViewPortTouched}, ref) => {
    const cameraRef = useRef(null);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const [styleURL, setStyleURL] = useState(StyleURL.OUTDOORS_2D);
    const [isStyleReady, setIsStyleReady] = useState(false);
    const [isCompassVisible, setCompassVisible] = useState(false);
    const [followUserLocation, setFollowUserLocation] = useState(false);
    const [followUserMode, setFollowUserMode] = useState(UserTrackingMode.Follow);
    const startPoint = useRef(null);

    const statuses = useSelector(getStatuses);
    const routeBounds = useSelector(getRouteBounds);
    const lineStrings = useSelector(getRouteLineStrings);
    const selectedEndpoint = useSelector(getSelectedEndpoint);

    const isNavMode = useSelector(getIsNavMode);
    const locationPermission = useSelector(getLocationPermission);
    const userLocation = useSelector(getUserLocation);

    // GPS location listener
    useEffect(() => {
      let isMounted = true;
      if (!locationPermission) return;
      const fetchLastKnownLocation = async () => {
        locationManager
          .getLastKnownLocation()
          .then(location => {
            if (isMounted) {
              let {coords} = location;
              let {latitude, longitude} = coords;
              dispatch(setUserLocation([longitude, latitude]));
            }
          })
          .catch(error => console.error('Failed to fetch last known location:', error));
      };
      fetchLastKnownLocation();
      const locationUpdateListener = location => {
        if (isMounted) {
          let {coords} = location;
          let {latitude, longitude} = coords;
          dispatch(setUserLocation([longitude, latitude]));
        }
      };
      locationManager.addListener(locationUpdateListener);
      return () => {
        locationManager.removeListener(locationUpdateListener);
        isMounted = false;
      };
    }, [locationPermission, locationManager._lastKnownLocation]);

    useEffect(() => {
      if (!isNavMode) {
        startPoint.current = null;
      }
    }, [isNavMode]);

    useEffect(() => {
      if (statuses.routeFeatures === 'fulfilled') {
        setFollowUserLocation(false);
        onViewPortTouched(true);
        setTimeout(() => {
          goToRouteLocation();
        }, 10);
      }
    }, [statuses.routeFeatures]);

    // Navigation information updates
    useEffect(() => {
      if (!isNavMode || !userLocation) return;

      const elevation = lineStrings[0].elevation;
      const coordinates = lineStrings[0].geometry.coordinates;

      const line = turf.lineString(coordinates.map(coord => [coord[0], coord[1]]));
      const userPoint = turf.point(userLocation);
      const totalDistance = turf.length(line, {units: 'kilometers'});
      const snapped = turf.nearestPointOnLine(line, userPoint, {units: 'kilometers'});

      if (!startPoint.current) {
        startPoint.current = userPoint;
      }

      const {userStartToEnd, remainingDistance} = calculateNavigationDetails(
        startPoint.current,
        selectedEndpoint,
        coordinates,
        line,
        totalDistance,
        snapped,
        null,
        null,
        false,
      );

      if (snapped.properties.index !== -1 && snapped.properties.dist <= 0.05) {
        dispatch(setCurrentElevation(elevation[snapped.properties.index].toFixed(0)));
        dispatch(setDistanceLeft(remainingDistance));
        dispatch(setDistanceTraveled(turf.length(userStartToEnd, {units: 'kilometers'})));
        dispatch(setIsOnPath(true));
      } else {
        dispatch(setIsOnPath(false));
      }
    }, [userLocation, isNavMode]);

    // 'Locate Me'
    const goToUserLocation = useCallback(async () => {
      const locationOk = await checkLocation(goToUserLocation);

      if (!locationOk || !locationPermission || !userLocation || !cameraRef.current) return;

      setFollowUserLocation(false);

      setTimeout(() => {
        const commonSettings = {
          centerCoordinate: userLocation,
          animationMode: 'flyTo',
        };

        const modeSpecificSettings = isNavMode
          ? {
              zoomLevel: 17,
              pitch: 50,
              padding: {paddingTop: 300},
              animationDuration: 500,
            }
          : {
              zoomLevel: 15,
              pitch: 25,
              padding: {paddingTop: 0},
              animationDuration: 1000,
            };

        cameraRef.current.setCamera({...commonSettings, ...modeSpecificSettings});

        setTimeout(() => {
          setFollowUserMode(
            isNavMode ? UserTrackingMode.FollowWithHeading : UserTrackingMode.Follow,
          );
          setFollowUserLocation(true);
        }, modeSpecificSettings.animationDuration);
      }, 10);
    }, [userLocation, cameraRef, isNavMode, locationPermission]);

    // Pan camera to route location
    const goToRouteLocation = () => {
      setIsStyleReady(false);

      const duration = 1250;
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          bounds: {ne: routeBounds[0], sw: routeBounds[1]},
          zoomLevel: 15,
          pitch: 35,
          padding: {paddingTop: 45, paddingBottom: 45, paddingLeft: 45, paddingRight: 45},
          heading: 0,
          animationMode: 'flyTo',
          animationDuration: duration,
        });
        setTimeout(() => {
          setIsStyleReady(true);
        }, duration);
      }
    };

    // 2D/3D toggle
    const toggleDimension = useCallback(() => {
      setStyleURL(prevStyle => {
        switch (prevStyle) {
          case StyleURL.OUTDOORS_2D:
            return StyleURL.OUTDOORS_3D;
          case StyleURL.OUTDOORS_3D:
            return StyleURL.OUTDOORS_2D;
          case StyleURL.SATELLITE_2D:
            return StyleURL.SATELLITE_3D;
          case StyleURL.SATELLITE_3D:
            return StyleURL.SATELLITE_2D;
          default:
            return prevStyle;
        }
      });
    }, []);

    // Outdoor/Satellite mapstyle toggle
    const toggleMapStyle = useCallback(() => {
      setStyleURL(prevStyle => {
        switch (prevStyle) {
          case StyleURL.OUTDOORS_2D:
          case StyleURL.OUTDOORS_3D:
            return prevStyle === StyleURL.OUTDOORS_2D
              ? StyleURL.SATELLITE_2D
              : StyleURL.SATELLITE_3D;
          case StyleURL.SATELLITE_2D:
          case StyleURL.SATELLITE_3D:
            return prevStyle === StyleURL.SATELLITE_2D
              ? StyleURL.OUTDOORS_2D
              : StyleURL.OUTDOORS_3D;
          default:
            return prevStyle;
        }
      });
    }, []);

    useImperativeHandle(ref, () => ({
      goToUserLocation,
      toggleMapStyle,
      toggleDimension,
    }));

    const handleMapLoad = () => {
      setIsMapReady(true);
      setCompassVisible(true);
      setIsStyleReady(true);
    };

    const locationPuckKey = isNavMode ? 'isNavMode' : 'defaultMode';

    if (!locationPermission) {
      return <NoPermissionError text={t('permission.noLocation')} />;
    }

    if (isLoading) {
      return <LoadingSpinner status={statuses} />;
    }

    return (
      <>
        <MapView
          style={styles.map}
          styleURL={styleURL}
          zoomEnabled={true}
          rotateEnabled={true}
          pitchEnabled={true}
          logoEnabled={!isSearchVisible || statuses.routeFeatures === 'fulfilled'}
          attributionEnabled={!isSearchVisible || statuses.routeFeatures === 'fulfilled'}
          scaleBarEnabled={!isSearchVisible}
          compassEnabled={isCompassVisible} //workaround for compass: write it from scratch, link it to the map's orientation (probably camera). onpress, set camera to north and fade
          compassPosition={!isSearchVisible ? {top: 70, left: 10} : {top: -500, left: -500}}
          logoPosition={{bottom: 5, left: 5}}
          attributionPosition={{bottom: 5, left: 5}}
          scaleBarPosition={{top: 35, left: 10}}
          onDidFinishLoadingMap={handleMapLoad}>
          {statuses.routeFeatures === 'fulfilled' && <PathDrawer />}
          <Camera
            ref={cameraRef}
            followUserMode={followUserMode}
            followUserLocation={followUserLocation}
          />
          <Viewport
            onStatusChanged={event => {
              if (event.to.kind === 'idle') {
                setFollowUserLocation(false);
                onViewPortTouched(true);
              } else {
                onViewPortTouched(false);
              }
            }}
          />
          {isStyleReady && (
            <>
              <Images key={'navigation'} scale={0.5} images={{navigation: ASSETS.navigation}} />
              <LocationPuck
                key={locationPuckKey}
                visible={true}
                showsUserHeadingIndicator={true}
                puckBearing="heading"
                bearingImage={isNavMode ? 'navigation' : undefined}
                scale={0.3}
                pulsing={{isEnabled: !isNavMode, color: '#4a90e2', radius: 35}}
              />
            </>
          )}
        </MapView>
      </>
    );
  },
);

export default MapLayout;
