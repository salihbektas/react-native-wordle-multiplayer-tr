import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router'



export default function RootLayout() {





  return (
    <View>
      <Pressable onPress={() => {
        router.navigate('singleplayer')
      }}>
        <Text>Single Player</Text>
      </Pressable>

      <Pressable >
        <Text>Multi Player</Text>
      </Pressable>
      
    </View>
  );
}
