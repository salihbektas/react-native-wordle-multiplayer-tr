import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/Colors';
import ThemedText from '@/components/ThemedText';
import ButtonText from '@/components/ButtonText';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { background } = colors[colorScheme ?? 'dark'];
  return (
    <View style={[styles.main, { backgroundColor: background }]}>
      <ThemedText style={styles.heading}>WORDLE TÜRKÇE</ThemedText>

      <Pressable
        style={styles.button}
        onPress={() => router.navigate('./singleplayer')}
      >
        <ButtonText style={styles.buttonText}>Tek Kişilik</ButtonText>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.navigate('./serverBrowser')}
      >
        <ButtonText style={styles.buttonText}>Çok Kişilik</ButtonText>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.navigate('./setting')}
      >
        <ButtonText style={styles.buttonText}>Ayarlar</ButtonText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 16,
  },

  heading: {
    marginHorizontal: 'auto',
    marginBottom: 200,
    fontSize: 24,
    fontWeight: '600',
  },

  button: {
    backgroundColor: colors.darkGray,
    padding: 8,
    borderRadius: 8,
    marginTop: 16,
  },

  buttonText: {
    fontSize: 24,
  },
});
