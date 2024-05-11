import { StyleSheet } from 'react-native';
import { normalize } from '../utils/formatters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
  },
  loading: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 99,
  },
  loadingText: {
    paddingBottom: 15,
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    zIndex: 100,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    position: 'absolute',
    paddingTop: normalize(45),
    height: '98%',
    right: 2,
    alignItems: 'center',
    gap: 15,
    justifyContent: 'flex-start',
  },
  backButton: {
    height: '98%',
    left: 2,
    padding: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  bottomButtonContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    bottom: 0,
  },
  chevronContainer: {
    width: '15%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 2.5,
    borderBottomWidth: 0,
  },
});

export default styles;
