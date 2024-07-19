import { Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import { colors } from '@/constants/Colors';
import Game from '@/components/Game';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { child, increment, onValue, runTransaction, update } from 'firebase/database';
import dbRootRef, { ServerType } from '@/utils/firebase';
import { router } from 'expo-router';
import { increaseTurn } from '@/features/playerSlice/playerSlice';


export default function multiplayer() {

  const {amIHost, playerName, dbRefName, answers, turn} = useSelector((state: RootState) => state.player)
  const dispatch = useDispatch()

  const [wordIndex, setWordIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [attempts, setAttempts] = useState(0)
  const [time, setTime] = useState(180)

  useEffect(() => {

    const unsubscribe = onValue(child(dbRootRef, dbRefName), snapshot => {
      if(snapshot.exists()){
        const data = snapshot.val()
        setWordIndex(answers[data.turn])
        if(data.turn > turn){
          dispatch(increaseTurn(data.turn))
          setIsPlaying(true)
          setTime(180)
        }
      }
      else{
        router.navigate('serverBrowser')
      }
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if(!isPlaying){
      const resutl: [number, number] = [-1, -1]
      if(time > 0 && attempts < 5){
        resutl[0] = attempts+1
        resutl[1] = 180-time
      }

      runTransaction(child(dbRootRef, dbRefName), (serverState:ServerType) => {
        const update: Record<string, [number,number]> = {}
        update[`${playerName}`] = resutl
        serverState.results = {...serverState.results, ...update }

        return serverState
      })
    }
  }, [isPlaying])

  function onPressNext(){
    if(amIHost){
      if(turn === 4){
        //TODO: end game
        return
      }
      const updates = {turn: increment(1)}
      update(child(dbRootRef, dbRefName), updates)
    }

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