import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT } from '../consts';

const chartStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
});

export default chartStyles;
