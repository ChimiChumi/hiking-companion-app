import { StyleSheet } from 'react-native';
import { normalize } from '../utils/formatters';

const navigationStyles = StyleSheet.create({
  sheet: {
    borderRadius: 20,
    marginHorizontal: normalize(15, 'width'),
    shadowColor: 'black',
    elevation: 3,
  },
  navSheet: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'black',
    shadowColor: 'black',
    elevation: 3,
    backgroundColor: '#fff4ee',
  },
  container: {
    flexDirection: 'row',
    paddingStart: normalize(15),
    paddingBottom: normalize(15),
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  gridCellLeft: {
    width: '80%',
  },
  gridCellRight: {
    width: '20%',
  },
  gridRow: {
    height: '25%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  section1: {
    width: '10%',
    borderColor: 'green',
  },
  section2: {
    width: '60%',
    textAlign: 'center',
    fontFamily: 'Inter',
    paddingStart: normalize(10),
    borderColor: 'green',
    textAlignVertical: 'center',
    fontSize: normalize(14),
  },
  section3: {
    width: '30%',
    borderColor: 'green',
    fontWeight: 'bold',
    textAlignVertical: 'center',
    fontSize: normalize(16),
  },
  offRoute: {
    height: '100%',
    width: '95%',
    fontSize: normalize(20),
    fontFamily: 'Inter',
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  infoIcons: {
    width: '100%',
    height: '100%',
  },
  stop: {
    width: normalize(50),
    height: normalize(50),
  }
});

export default navigationStyles;
