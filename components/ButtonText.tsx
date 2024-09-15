import { colors } from '../constants/Colors';
import { Text, TextProps } from 'react-native';

const ButtonText = ({ style, children, ...rest }: TextProps) => {
  return (
    <Text style={[style, { color: colors.white }]} {...rest}>
      {children}
    </Text>
  );
};
export default ButtonText;
