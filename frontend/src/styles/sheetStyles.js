import { StyleSheet } from 'react-native';

const sheetStyles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#fff4ee',
    borderRadius: 30,
    elevation: 10,
    shadowColor: 'black',
  },
  handleStyle: {
    backgroundColor: '#404040',
    width: 40,
    height: 5,
  },
  handleStyleNone: {
    opacity: 0,
    width: 0,
    height: 0,
  }
});

export default sheetStyles;
