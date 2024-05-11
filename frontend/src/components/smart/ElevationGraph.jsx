import React, {useEffect, useMemo, useRef} from 'react';
import {SafeAreaView} from 'react-native';
import {Provider, useSelector} from 'react-redux';
import {Group, LinearGradient, Path, useFont, vec} from '@shopify/react-native-skia';
import {CartesianChart, useAreaPath, useChartPressState, useLinePath} from 'victory-native';
import * as Haptics from 'expo-haptics';

import {getRouteLineStrings, getStatuses} from '../../../context/reducers/routeReducer';
import store from '../../../context/store';

import {COLORS} from '../../consts';

import ChartSlider from './ChartSlider';

import inter from '../../assets/fonts/inter-medium.ttf';
import chartStyles from '../../styles/chartStyles';

const initChartPressState = {x: 0, y: {meters: 0}};

const ElevationGraph = () => {
  const font = useFont(inter, 12);
  const lastPointRef = useRef(null);
  const {state, isActive} = useChartPressState(initChartPressState);

  const status = useSelector(getStatuses);
  const lineStrings = useSelector(getRouteLineStrings);

  const ELEVATION_DATA = useMemo(() => {
    if (status.routeFeatures === 'fulfilled') {
      return lineStrings[0]?.elevation.map((meters, index) => ({
        index: index,
        meters: meters,
      }));
    }
    return [];
  }, [status]);

  const axisOptions = useMemo(
    () => ({
      font,
      tickCount: 6,
      labelPosition: {y: 'outset'},
      axisSide: {y: 'left'},
      lineColor: COLORS.grid,
      labelColor: COLORS.text,
      labelOffset: {x: -500, y: 6},
    }),
    [font],
  );

  useEffect(() => {
    if (isActive === true) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [isActive]);

  return (
    <SafeAreaView style={chartStyles.container}>
      {status.routeFeatures === 'fulfilled' && (
        <CartesianChart
          data={ELEVATION_DATA}
          xKey="index"
          yKeys={['meters']}
          chartPressState={[state]}
          curve="linear"
          domainPadding={{top: 25}}
          axisOptions={axisOptions}
          gestureLongPressDelay={1}
          renderOutside={({chartBounds}) => (
            <Provider store={store}>
              <ChartSlider
                xPosition={state.x.position}
                yPosition={state.y.meters.position}
                bottom={chartBounds.bottom}
                top={chartBounds.top}
                activeValue={state.y.meters.value}
                activeIndex={state.x.value}
                lastPointRef={lastPointRef}
                isActive={isActive}
                feature={lineStrings}
              />
            </Provider>
          )}>
          {({chartBounds, points}) => (
            <>
              <Graph
                points={points.meters}
                startX={state.x.position}
                endX={state.x.position}
                {...chartBounds}
              />
            </>
          )}
        </CartesianChart>
      )}
    </SafeAreaView>
  );
};

const Graph = ({points, top, bottom}) => {
  const {path: areaPath} = useAreaPath(points, bottom);
  const {path: linePath} = useLinePath(points);

  return (
    <>
      <Group opacity={1}>
        <Path path={areaPath} style="fill">
          <LinearGradient
            start={vec(0, 0)}
            end={vec(top, bottom)}
            colors={[COLORS.tint, `${COLORS.tint}33`]}
          />
        </Path>
        <Path path={linePath} style="stroke" strokeWidth={2} color={COLORS.tint} />
      </Group>
    </>
  );
};

export default ElevationGraph;
