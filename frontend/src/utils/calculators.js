import * as turf from '@turf/turf';

export function calculateNavigationDetails(
  userPoint,
  endpoint,
  coordinates,
  line,
  totalDistance,
  snapped,
  altitudes,
  speed,
  isUserFar,
) {

  if (coordinates.length === 0) {
    return;
  }

  let endIndex;
  let startIndex;

  if (endpoint === 'end') {
    endIndex = coordinates.length - 1;
    startIndex = 0;
  } else {
    endIndex = 0;
    startIndex = coordinates.length - 1;
  }

  let startToClosest, userStartToEnd, distanceToClosestPoint, remainingDistance;

  /*
  * If user's location was ever available, currently the last known location is taken in consideration
  * If this is not the expected behavior, check if user has GPS enabled (await Location.hasServicesEnabledAsync())
  */
  if (userPoint && snapped) {
    startToClosest = turf.lineSlice(
      line.geometry.coordinates[startIndex],
      snapped.geometry.coordinates,
      line
    );
    userStartToEnd = turf.lineSlice(
      userPoint.geometry.coordinates,
      snapped.geometry.coordinates,
      line
    );
    distanceToClosestPoint = turf.length(startToClosest, { units: 'kilometers' });
    remainingDistance = isUserFar ? totalDistance : totalDistance - distanceToClosestPoint;
  } else {
    remainingDistance = totalDistance;
  }
  let estimatedTime = {};
  if (altitudes && speed) {
    const timeInHours = calculateTime(
      remainingDistance,
      altitudes,
      speed,
      startIndex,
      endIndex
    );
    estimatedTime = {
      hours: Math.floor(timeInHours),
      minutes: Math.round((timeInHours - Math.floor(timeInHours)) * 60),
    };
  }

  return { userStartToEnd, remainingDistance, estimatedTime };
}

function calculateTime(distance, altitudes, speed, startIndex, endIndex) {
  let effectiveDistance = distance;
  let elevationStart = altitudes[startIndex];
  let elevationEnd = altitudes[endIndex];
  let elevationChange = elevationEnd - elevationStart;

  // Determine the ascent and descent based on the direction
  let totalAscent = elevationChange > 0 ? elevationChange : 0;
  let totalDescent = elevationChange < 0 ? Math.abs(elevationChange) : 0;

  let ascentImpact = totalAscent / 1000 * 0.50; // Strong impact for ascent
  let descentImpact = totalDescent / 1000 * 0.5; // Less impact for descent

  let adjustedSpeed = speed * (1 - ascentImpact + descentImpact);
  let timeInHours = effectiveDistance / adjustedSpeed;

  return timeInHours;
}

export function findClosestIndex(coordinates, markerCoordinate) {
  let closestIndex = -1;
  let closestDistance = Infinity;

  for (let i = 0; i < coordinates.length; i++) {
    const coordinate = coordinates[i];
    const distance = turf.distance(turf.point(coordinate), turf.point(markerCoordinate), {
      units: 'kilometers',
    });

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
}
