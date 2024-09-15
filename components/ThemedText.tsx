import { colors } from '../constants/Colors';
import { Text, TextProps, useColorScheme } from 'react-native';

const ThemedText = ({ style, children, ...rest }: TextProps) => {
  const colorScheme = useColorScheme();
  const color = colors[colorScheme ?? 'dark'].text;

  return (
    <Text style={[style, { color }]} {...rest}>
      {children}
    </Text>
  );
};
export default ThemedText;
