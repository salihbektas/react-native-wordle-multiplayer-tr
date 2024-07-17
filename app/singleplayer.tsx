import { Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import { colors } from '@/constants/Colors';
import Game from '@/components/Game';
import { useState } from 'react';
import { WORDSLENGTH } from '@/constants/constants';


export default function App() {

  const [wordIndex, setWordIndex] = useState(Math.floor(Math.random()*WORDSLENGTH))
  const [isPlaying, setIsPlaying] = useState(true)

  function onPressNext(){
    setWordIndex(Math.floor(Math.random()*WORDSLENGTH))
    setIsPlaying(true)
  }


  return (
    <View>
      <Modal visible={!isPlaying} animationType='fade' transparent={true}>
        <View style={styles.modal}>
          <Pressable style={styles.next} onPress={onPressNext}>
            <Text style={styles.letter}>Sıradaki</Text>
          </Pressable>
        </View>
      </Modal>
      <Game key={wordIndex} isPlaying={isPlaying} answerIndex={wordIndex} setIsPlaying={setIsPlaying}/>
    </View>
  )
}

const styles = StyleSheet.create({

  modal:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  next:{
    width: '75%',
    height: '75%',
    backgroundColor: colors.darkGray,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },

  letter: {
    color: colors.white,
    fontWeight : '600',
    fontSize: 12
  },

});