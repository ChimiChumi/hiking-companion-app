import { StyleSheet } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../consts';

const markerInfoStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    maxWidth: SCREEN_WIDTH * 0.5,
    fontWeight: 'normal',
    fontFamily: 'Inter',
  },
  altitudeLabel: {
    fontSize: 15,
    alignItems: 'flex-end',
    fontFamily: 'Inter',
  },
  altitude: {
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  image: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.3,
    borderRadius: 15,
    marginRight: 5,
    borderWidth: 1.5,
    borderColor: 'black',
    marginTop: 5,
  },
  description: {
    fontFamily: 'Inter',
    textAlign: 'justify'
  },
  gridContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  gridCell: {
    width: '50%',
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  gridCellFullWidth: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignSelf: 'flex-start',
  },
});

export default markerInfoStyles;
