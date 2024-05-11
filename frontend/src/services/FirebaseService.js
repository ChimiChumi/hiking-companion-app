import firestore from '@react-native-firebase/firestore'
import { offlineManager } from '@rnmapbox/maps';
import { StyleURL } from '../consts';

export async function getRoutes() {
  const docRoutes = await firestore().collection('routes').get();
  const routes = docRoutes.docs.map(doc => ({
    ...doc.data(),
    key: doc.id,
  }));

  return routes;
}
export const checkAndDownloadNewRoutes = async (progressListener, errorListener) => {
  // DEBUG ONLY
  // await offlineManager.resetDatabase();

  const existingPacks = await offlineManager.getPacks();
  const existingPackNames = existingPacks.map(pack => pack.name);
  const docRoutes = await firestore().collection('routes').get();
  const routes = docRoutes.docs.map(doc => ({
    ...doc.data(),
    key: doc.id,
  }));

  for (const route of routes) {
    const boundsForMapbox = route.bounds.map(bound => [bound.longitude, bound.latitude]);

    for (const [styleName, styleURL] of Object.entries(StyleURL)) {
      const packName = `[${styleName}] - ${route.key}`;

      if (!existingPackNames.includes(packName)) {
        const pack = {
          name: packName,
          styleURL: styleURL,
          minZoom: 15,
          maxZoom: 20,
          bounds: boundsForMapbox,
        };

        // console.log(`Downloading: ${pack.name}`);
        try {
          offlineManager.createPack(pack, progressListener, errorListener);
        } catch (error) {
          // console.error(`Error downloading pack ${pack.name}:`, error);
        }
      } else {
        // console.log(`Pack already exists, skipping: ${packName}`);
      }
    }
  }
};

export async function getFeatures() {
  const docFeatures = await firestore().collection('features').get();
  const features = docFeatures.docs.map(doc => ({
    ...doc.data()
  }));

  return features;
}

export async function saveToMemory() {
  const docFeatures = await firestore().collection('features').get();
  const routeFeaturesDict = {};

  docFeatures.docs.forEach(doc => {
    const feature = doc.data();
    const routeId = feature.routeId;
    const geoPoints = feature.geometry.coordinates;
    const type = feature.geometry.type;
    let arrayPoints = undefined;

    function pointHandling(geoPoint) {
      const arrayPoints = [];
      arrayPoints.push(geoPoint.longitude, geoPoint.latitude);
      return arrayPoints;
    }
    function lineStringHandling(geoPoints) {
      const arrayPoints = []
      for (const geoPoint of geoPoints) {
        arrayPoints.push([geoPoint.longitude, geoPoint.latitude]);
      }
      return arrayPoints;
    }

    function polygonHandling(geoPointsArray) {
      const polygons = [];
      for (const pointsIndex in geoPointsArray) {
        const geoPoints = geoPointsArray[pointsIndex];
        const tempArray = [];
        for (const geoPoint of geoPoints) {
          tempArray.push([geoPoint.longitude, geoPoint.latitude]);
        }
        polygons.push(tempArray);
      }
      return polygons;
    }

    switch (type) {
      case 'Point':
        arrayPoints = pointHandling(geoPoints);
        break;
      case 'LineString':
        arrayPoints = lineStringHandling(geoPoints);
        break;
      case 'Polygon':
        arrayPoints = polygonHandling(geoPoints);
        break;
    }

    feature.geometry.coordinates = arrayPoints;

    if (!routeFeaturesDict[routeId]) {
      routeFeaturesDict[routeId] = {
        type: 'FeatureCollection',
        features: []
      };
    }
    routeFeaturesDict[routeId].features.push(feature);
  });

  return routeFeaturesDict;
}

export async function getRouteFeatures(routeId) {
  function pointHandling(geoPoint) {
    const arrayPoints = [];
    arrayPoints.push(geoPoint.longitude, geoPoint.latitude);
    return arrayPoints;
  }
  function lineStringHandling(geoPoints) {
    const arrayPoints = []
    for (const geoPoint of geoPoints) {
      arrayPoints.push([geoPoint.longitude, geoPoint.latitude]);
    }
    return arrayPoints;
  }

  function polygonHandling(geoPointsArray) {
    const polygons = [];
    for (const pointsIndex in geoPointsArray) {
      const geoPoints = geoPointsArray[pointsIndex];
      const tempArray = [];
      for (const geoPoint of geoPoints) {
        tempArray.push([geoPoint.longitude, geoPoint.latitude]);
      }
      polygons.push(tempArray);
    }
    return polygons;
  }

  const docFeatures = await firestore().collection('features').where('routeId', '==', routeId).get();
  const featuresList = [];

  docFeatures.docs.map(doc => featuresList.push({ ...doc.data() }));
  for (const feature of featuresList) {
    const geoPoints = feature.geometry.coordinates;
    const type = feature.geometry.type;
    var arrayPoints = undefined;
    switch (type) {
      case 'Point': {
        arrayPoints = pointHandling(geoPoints);
        break;
      }
      case 'LineString': {
        arrayPoints = lineStringHandling(geoPoints);
        break;
      }
      case 'Polygon':
        arrayPoints = polygonHandling(geoPoints);
        break;
    }
    feature.geometry.coordinates = arrayPoints;
  }
  return featuresList;
}
