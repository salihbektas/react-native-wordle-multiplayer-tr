import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '@/constants/Colors';

export default function RootLayout() {
  return (
    <View style={styles.main}>
      <Text style={styles.heading}>WORDLE TÜRKÇE</Text>
      <Link href='./singleplayer' asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Tek Kişilik</Text>
        </Pressable>
      </Link>
      <Link href='./serverBrowser' asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Çok Kişilik</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.black,
    padding: 16,
  },

  heading: {
    color: colors.white,
    marginHorizontal: 'auto',
    marginBottom: 200,
    fontSize: 24,
    fontWeight: '600',
  },

  button: {
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 8,
    marginTop: 16,
  },

  buttonText: {
    color: colors.black,
    fontSize: 24,
  },
});
