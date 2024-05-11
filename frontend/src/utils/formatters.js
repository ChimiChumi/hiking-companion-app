
import { PixelRatio } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../consts';

export function formatDistance(distance) {
  if (distance < 0.001) {
    return '0 m';
  } else if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  } else {
    return `${distance.toFixed(2)} km`;
  }
}

export function formatTime(time, t) {
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

  const parts = [];
  if (hours > 0) parts.push(`${hours}${t('label.hours')}`);
  if (minutes > 0) parts.push(`${minutes}${t('label.minutes')}`);
  if (seconds > 0) parts.push(`${seconds}${t('label.seconds')}`);

  return parts.length > 0 ? parts.join(' ') : '0s';
}

export function normalize(size, based = 'height') {
  const baseWidth = 360;
  const baseHeight = 800;

  const scaleWidth = SCREEN_WIDTH / baseWidth;
  const scaleHeight = SCREEN_HEIGHT / baseHeight;

  const newSize = based === 'height' ? size * scaleHeight : size * scaleWidth;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
