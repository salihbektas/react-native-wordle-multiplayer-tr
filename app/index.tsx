import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';



export default function RootLayout() {





  return (
    <View>
      <Pressable >
        <Text>Single Player</Text>
      </Pressable>

      <Pressable >
        <Text>Multi Player</Text>
      </Pressable>
      
    </View>
  );
}
