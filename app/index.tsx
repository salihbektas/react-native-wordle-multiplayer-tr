import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router'


export default function RootLayout() {


  return (
    <View>
      <Pressable style={styles.button} onPress={() => {
        router.navigate('singleplayer')
      }}>
        <Text>Single Player</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => {
        router.navigate('multiplayer')
      }}>
        <Text>Multi Player</Text>
      </Pressable>
      
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    margin: 8
  }
})