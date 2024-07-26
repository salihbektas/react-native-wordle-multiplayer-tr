import { Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import { colors } from '@/constants/Colors';
import Game from '@/components/Game';
import { useState } from 'react';
import { WORDSLENGTH } from '@/constants/constants';


export default function App() {

  const [wordIndex, setWordIndex] = useState(Math.floor(Math.random()*WORDSLENGTH))
  const [isPlaying, setIsPlaying] = useState(true)
  const [attempts, setAttempts] = useState(0)
  const [time, setTime] = useState(180)

  function onPressNext(){
    setWordIndex(Math.floor(Math.random()*WORDSLENGTH))
    setIsPlaying(true)
  }


  return (
    <View style={styles.main}>
      <Modal visible={!isPlaying} animationType='fade' transparent={true}>
        <View style={styles.modal}>
          <Pressable style={styles.next} onPress={onPressNext}>
            <Text style={styles.letter}>Sıradaki</Text>
          </Pressable>
        </View>
      </Modal>
      <Game key={wordIndex} 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        answerIndex={wordIndex}
        time={time}
        setTime={setTime}
        setAttempts={setAttempts}
      />
    </View>
  )
}

const styles = StyleSheet.create({

  main: {
    flex: 1,
  },

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