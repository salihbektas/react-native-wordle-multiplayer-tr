import { store } from '@/store/store';
import { Slot } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

export default function Layout() {
  return(
    <Provider store={store}>
      <Slot />
      <Toast/>
    </Provider>
  )
}