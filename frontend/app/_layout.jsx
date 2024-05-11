import '../i18n';
import {Stack} from 'expo-router';
import {Provider} from 'react-redux';
import {useTranslation} from 'react-i18next';
import store from '../context/store';

export default function Layout() {
  const commonHeaderStyle = {
    backgroundColor: 'black',
  };

  const qrHeaderStyle = {
    backgroundColor: 'black',
  };

  const {t} = useTranslation();
  
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerStyle: commonHeaderStyle,
          headerTintColor: 'white',
        }}>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen
          name="qrscannerscreen"
          options={{
            title: t('QR.header'),
            headerStyle: qrHeaderStyle,
          }}
        />
      </Stack>
    </Provider>
  );
}
