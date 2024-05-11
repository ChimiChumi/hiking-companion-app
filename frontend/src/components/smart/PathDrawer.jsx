import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {LineLayer, FillLayer, ShapeSource, SymbolLayer, Images} from '@rnmapbox/maps';

import {getFileIconURI} from '../../services/FileSystemService';
import {
  getActiveCoordinate,
  getRouteLineStrings,
  getRouteMarkers,
  getRoutePolygons,
  getStatuses,
} from '../../../context/reducers/routeReducer';
import {ASSETS, COLORS as colors} from '../../consts';

import MarkerDrawer from './MarkerDrawer';

const minZoom = 12;
const maxZoom = 22;

const PathDrawer = React.memo(() => {
  const status = useSelector(getStatuses);
  const activeCoordinate = useSelector(getActiveCoordinate);

  const lineStrings = useSelector(getRouteLineStrings);
  const markers = useSelector(getRouteMarkers);
  const polygons = useSelector(getRoutePolygons);

  const [markerComponents, setMarkerComponents] = useState([]);

  useEffect(() => {
    if (status.routeFeatures === 'fulfilled') {
      processMarkers(markers, lineStrings);
    }
  }, [status.routeFeatures]);

  const processMarkers = async (markers, lineStrings) => {
    const markerElements = await Promise.all([
      ...markers.map(async (feature, index) => {
        const fileURI = await getFileIconURI(feature.properties.Symbol);
        const imageKey = 'marker_' + index;
        return (
          <React.Fragment key={`marker-regular-${index}`}>
            <MarkerDrawer feature={feature} index={index} image={fileURI} imageKey={imageKey} />
          </React.Fragment>
        );
      }),
      ...lineStrings.flatMap(lineString => {
        const coords = lineString.geometry.coordinates;
        const firstPoint = coords[0];
        const lastPoint = coords[coords.length - 1];
        return [
          <React.Fragment key={`start-point`}>
            <MarkerDrawer
              feature={{type: 'Feature', geometry: {type: 'Point', coordinates: firstPoint}}}
              index={`start`}
              image={ASSETS.endpoint}
              imageKey={`start`}
              markerType="start"
            />
          </React.Fragment>,
          <React.Fragment key={`end`}>
            <MarkerDrawer
              feature={{type: 'Feature', geometry: {type: 'Point', coordinates: lastPoint}}}
              index={`end`}
              image={ASSETS.endpoint}
              imageKey={`end`}
              markerType="end"
            />
          </React.Fragment>,
        ];
      }),
    ]);
    setMarkerComponents(markerElements);
  };

  const points = {
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: activeCoordinate,
      },
    ],
  };

  const renderLines = () => {
    return (
      status.routeFeatures === 'fulfilled' && (
        <>
          <ShapeSource id="lineLayer-1" shape={{type: 'FeatureCollection', features: lineStrings}}>
            <LineLayer
              id="lineLayer-1"
              style={{
                lineWidth: 5,
                lineColor: '#e6693c',
                lineCap: 'round',
                lineJoin: 'round',
              }}
              minZoomLevel={minZoom}
              maxZoomLevel={maxZoom}
            />
          </ShapeSource>

          <ShapeSource id="polygon" shape={{type: 'FeatureCollection', features: polygons}}>
            <FillLayer
              id="fillLayer"
              style={{
                fillOpacity: 0.7,
                fillColor: 'grey',
              }}
              minZoomLevel={minZoom}
              maxZoomLevel={maxZoom}
            />
            <LineLayer
              id="lineLayer-2"
              style={{
                lineWidth: 3,
                lineJoin: 'round',
                lineCap: 'round',
                lineDasharray: [1, 2],
                lineBlur: 0.5,
                lineColor: 'black',
              }}
              minZoomLevel={minZoom}
              maxZoomLevel={maxZoom}
            />
          </ShapeSource>
          {activeCoordinate && (
            <ShapeSource id="altitude-layer" shape={points}>
              <Images images={{foo: ASSETS.selection}} />
              <SymbolLayer
                id="altitude"
                style={{
                  iconImage: 'foo',
                  iconSize: 0.06,
                  iconAllowOverlap: true,
                  iconIgnorePlacement: true,
                  iconAnchor: 'center',
                  iconTranslateAnchor: 'map',
                  iconPitchAlignment: 'map',
                  iconAllowOverlap: true,
                  iconIgnorePlacement: true,
                }}
                minZoomLevel={minZoom}
                maxZoomLevel={maxZoom}
              />
            </ShapeSource>
          )}
        </>
      )
    );
  };

  return (
    <>
      {renderLines()}
      {markerComponents}
    </>
  );
});

export default PathDrawer;
