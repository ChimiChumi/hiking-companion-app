import { StyleSheet } from 'react-native';

const cameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  reticle: {
    position: 'absolute',
    alignSelf: 'center',
    height: 120,
    width: 120,
    borderColor: 'red',
    borderWidth: 5,
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    alignContent: 'center',
    justifyContent: 'center',
    gap: 24,
    width: '100%',
  },
  text: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default cameraStyles;
