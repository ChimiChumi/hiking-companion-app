import { StyleSheet } from 'react-native';
import { normalize } from '../utils/formatters';

const navStartStyles = StyleSheet.create({
  sheet: {
    marginHorizontal: normalize(12, 'width'),
    borderRadius: 20,
    borderColor: 'grey',
    shadowColor: 'black',
  },
  startSheet: {
    borderRadius: 30,
    height: 30,
    elevation: 2,
  },
  content: {
    borderRadius: 15,
    paddingHorizontal: normalize(12, 'width'),
    backgroundColor: '#ffffff',
    height: '100%',
  },
  title: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    paddingLeft: normalize(5, 'width'),
  },
  body: {
    fontSize: normalize(15.5),
    paddingLeft: normalize(5, 'width'),
  },
});

export default navStartStyles;
