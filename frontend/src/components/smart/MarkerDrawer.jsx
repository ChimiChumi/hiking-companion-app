import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ShapeSource, SymbolLayer, Images} from '@rnmapbox/maps';

import {getSelectedEndpoint, getSelectedMarker} from '../../../context/reducers/markerReducer';
import {getIsNavMode} from '../../../context/reducers/navigationReducer';

import {generateLinearSequence} from '../../utils/helpers';
import {handleMarkerPress} from '../../utils/handlers';

const MarkerDrawer = React.memo(({feature, index, image, imageKey, markerType}) => {
  const [iconSize, setIconSize] = useState(0.4);
  const [endpointSize, setEndPointSize] = useState(0.8);
  const [isAnimating, setIsAnimating] = useState(false);

  const dispatch = useDispatch();
  const selectedMarkerId = useSelector(getSelectedMarker);
  const selectedEndpoint = useSelector(getSelectedEndpoint);
  const isNavMode = useSelector(getIsNavMode);

  const isSelected = selectedMarkerId === index;
  const isEndpoint = markerType === 'start' || markerType === 'end';

  useEffect(() => {
    let startSize;
    let endSize;

    if (isNavMode) {
      if (isEndpoint && selectedEndpoint !== markerType) {
        startSize = 0;
        endSize = 0;
      } else if (isEndpoint && selectedEndpoint === markerType) {
        startSize = 0.8;
        endSize = 0.8;
      }
      else {
        startSize = isSelected ? 0.5 : 0.8;
        endSize = isSelected ? 0.8 : 0.5;
      }
    } else {
      if (isEndpoint) {
        startSize = isSelected ? 0.6 : 0.9;
        endSize = isSelected ? 0.9 : 0.6;
      } else {
        startSize = isSelected ? 0.3 : 0.6;
        endSize = isSelected ? 0.6 : 0.3;
      }
    }

    simulateSpringEffect(startSize, endSize);
  }, [isSelected, isNavMode, isEndpoint]);

  // Native animation for marker size (due to mapbox compatibility)
  const simulateSpringEffect = useCallback((startSize, endSize) => {
    setIsAnimating(true);

    const steps = 8;
    const sequence = generateLinearSequence(startSize, endSize, steps);

    let step = 0;
    const animate = () => {
      if (step < sequence.length) {
        const updateSize = sequence[step];
        if (isEndpoint) {
          setEndPointSize(updateSize);
        } else {
          setIconSize(updateSize);
        }
        step++;
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    animate();
  }, []);

  return (
    <ShapeSource
      key={`marker-${index}`}
      id={`marker-${index}`}
      shape={feature}
      onPress={() => handleMarkerPress(dispatch, index, isAnimating, isSelected, isNavMode)}>
      <Images images={{[imageKey]: image}} />
      <SymbolLayer
        key={`marker-${index}`}
        id={`layer-${index}`}
        style={{
          iconImage: imageKey,
          iconAnchor: 'bottom',
          iconSize: isEndpoint ? endpointSize : iconSize,
          iconTranslate: [isEndpoint ? 10 : 0, isEndpoint ? 5 : 0],
          iconOpacity: isNavMode ? 1 : isEndpoint ? 1 : 0.8,
          iconTranslateAnchor: 'viewport',
          iconAllowOverlap: false,
          iconIgnorePlacement: true,
        }}
        minZoomLevel={12}
        maxZoomLevel={22}
      />
    </ShapeSource>
  );
});

export default MarkerDrawer;
