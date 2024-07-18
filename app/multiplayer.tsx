import { Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import { colors } from '@/constants/Colors';
import Game from '@/components/Game';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { child, onValue, update } from 'firebase/database';
import dbRootRef from '@/utils/firebase';
import { router } from 'expo-router';
import { increaseTurn } from '@/features/playerSlice/playerSlice';


export default function multiplayer() {

  const {amIHost, playerName, dbRefName, answers, turn} = useSelector((state: RootState) => state.player)
  const dispatch = useDispatch()

  const [wordIndex, setWordIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {

    const unsubscribe = onValue(child(dbRootRef, dbRefName), snapshot => {
      if(snapshot.exists()){
        const data = snapshot.val()
        setWordIndex(answers[data.turn])
        dispatch(increaseTurn(data.turn))

      }
      else{
        router.navigate('serverBrowser')
      }
    })

    return unsubscribe
  }, [])

  function onPressNext(){
    if(amIHost){
      const updates = {turn: turn+1}
      update(child(dbRootRef, dbRefName), updates)
    }

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