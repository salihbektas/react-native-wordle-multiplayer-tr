import { colors } from '@/constants/Colors';
import { toastConfig } from '@/constants/toastConfig';
import { store } from '@/store/store';
import { Slot } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

export default function Layout() {
  return(
    <Provider store={store}>
      <SafeAreaView style={styles.safeArea}>
        <Slot />
        <Toast config={toastConfig} />
      </SafeAreaView>
    </Provider>
  )
}

const styles = StyleSheet.create({
  safeArea : {
    flex:1,
    backgroundColor: colors.black
  }
})