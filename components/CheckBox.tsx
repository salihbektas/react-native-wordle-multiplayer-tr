import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/Colors';
import { useColorScheme, View } from 'react-native';
type propType = {
  size: number;
  value: boolean;
};
const CheckBox = ({ size, value }: propType) => {
  const colorScheme = useColorScheme();
  const { background, text } = colors[colorScheme ?? 'dark'];
  return (
    <View
      style={{
        backgroundColor: value ? colors.green : background,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: text,
        paddingLeft: size / 20,
        paddingTop: size / 10,
      }}
    >
      {value && <Feather name='check' size={size * 0.8} color={text} />}
    </View>
  );
};
export default CheckBox;
