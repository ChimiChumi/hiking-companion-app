import {View, Image, Text} from 'react-native';
import navigationStyles from '../../styles/navigationStyles';

const RowItem = ({icon, displayText, value}) => {
  return (
    <View style={navigationStyles.gridRow}>
      <View style={navigationStyles.section1}>
        <Image source={icon} style={navigationStyles.infoIcons} resizeMode='contain' />
      </View>
      <Text style={navigationStyles.section2}>{displayText}</Text>
      <Text style={navigationStyles.section3}>{value}</Text>
    </View>
  );
};
export default RowItem;
