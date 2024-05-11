import {Image, TouchableOpacity} from 'react-native';
import {debounce} from 'lodash';
const ActionButton = ({imageSource, actionFunction, buttonStyle}) => {
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={debounce(actionFunction, 500, {
        leading: true,
        trailing: false,
      })}>
      <Image
        source={imageSource}
        style={{flex: 1, width: '100%', height: '100%'}}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default ActionButton;
