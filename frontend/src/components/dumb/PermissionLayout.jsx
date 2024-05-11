import {View, Text, ActivityIndicator, Pressable} from 'react-native';
import {openSettings} from 'react-native-permissions';
import {useTranslation} from 'react-i18next';

import styles from '../../styles/permissionStyles';

const PermissionLayout = ({text}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.centeredView}>
      <Text style={styles.text}>{text}</Text>
      <ActivityIndicator style={styles.spinner} size="large" color={'#000000'} />
      <Pressable
        onPress={() => openSettings()}
        style={({pressed}) => [styles.settingsButton, pressed && styles.pressedButton]}>
        <Text style={styles.buttonText}>{t('permission.settings')}</Text>
      </Pressable>
    </View>
  );
};

export default PermissionLayout;
