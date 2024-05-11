import {View, Text, ActivityIndicator} from 'react-native';
import styles from '../../styles/styles';
import Delayed from './Delay';
import {useTranslation} from 'react-i18next';

const LoadingSpinner = () => {
  const {t} = useTranslation();

  return (
    <>
      <View style={styles.loading} pointerEvents="box-only">
        <Delayed waitBeforeShow={3000}>
          <Text style={styles.loadingText}>{t('label.loading')}</Text>
        </Delayed>
        <ActivityIndicator style={styles.spinner} size="large" color={'#FFFFFF'} />
      </View>
    </>
  );
};

export default LoadingSpinner;
