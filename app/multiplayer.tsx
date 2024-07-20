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

  const [wordIndex, setWordIndex] = useState(answers[0])
  const [isPlaying, setIsPlaying] = useState(true)
  const [attempts, setAttempts] = useState(0)
  const [time, setTime] = useState(180)
  const [results, setResults] = useState<Record<string, [number,number]>>({})

  useEffect(() => {

    const unsubscribe = onValue(child(dbRootRef, dbRefName), snapshot => {
      if(snapshot.exists()){
        const data: ServerType = snapshot.val()

        setResults(data.results)
        if(data.playerList.every(player => data.results[player][0] === 0)){
          setWordIndex(answers[data.turn])
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
      if(time > 0 && attempts < 6){
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
      const initialResults = {...results}
      Object.keys(results).forEach(player => initialResults[player] = [0,0])
      const updates = {turn: increment(1), results: initialResults}
      update(child(dbRootRef, dbRefName), updates)
    }

  }


  return (
    <View style={styles.main}>
      <Modal visible={!isPlaying} animationType='fade' transparent={true}>
        <View style={styles.modal}>
          <View style={styles.list}>
            {
              Object.keys(results)
                .filter(player => results[player][0] !== 0 && results[player][1] !== 0)
                .map(player => {
                  if(results[player][0] === -1){
                    return <Text key={player} style={styles.letter} >{`${player}: Başarısız `}</Text>
                  }
                  return <Text key={player} style={styles.letter} >
                    {`${player}: ${results[player][0]} \\ ${results[player][1]}`}
                  </Text>
                  }
                )
            }
          </View>
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
    width: '75%',
    height: '75%',
    margin: 'auto',
    backgroundColor: colors.darkGray,
    borderRadius: 16,
  },
  
  list: {
    flex: 9,
    marginHorizontal: 'auto',
    paddingTop: 8,
  },

  next:{
    flex: 1,
    alignItems: 'center'
  },

  letter: {
    color: colors.white,
    fontWeight : '600',
    fontSize: 30
  },

});