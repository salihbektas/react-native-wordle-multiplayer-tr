import { colors } from '@/constants/Colors';
import { toastConfig } from '@/constants/toastConfig';
import { store } from '@/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Slot, SplashScreen } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Appearance, Platform, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('dark');
        const isDark = jsonValue != null ? JSON.parse(jsonValue) : true;
        if (Platform.OS !== 'web')
          Appearance.setColorScheme(isDark ? 'dark' : 'light');
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    })();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <SafeAreaView style={styles.safeArea} onLayout={onLayoutRootView}>
          <Slot />
          <Toast config={toastConfig} />
        </SafeAreaView>
      </Provider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.green,
  },
});
