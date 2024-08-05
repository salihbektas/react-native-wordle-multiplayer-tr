import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { colors } from './Colors';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ backgroundColor: colors.green, borderLeftWidth: 0 }}
      text1Style={{ color: colors.white }}
    />
  ),

  info: (props: any) => (
    <InfoToast
      {...props}
      style={{ backgroundColor: colors.darkGray, borderLeftWidth: 0 }}
      text1Style={{ color: colors.white }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ backgroundColor: colors.white, borderLeftWidth: 0 }}
      text1Style={{ color: colors.black }}
    />
  ),

  
}