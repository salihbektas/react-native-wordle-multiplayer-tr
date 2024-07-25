import { Pressable, StyleSheet, Text, View} from 'react-native';
import { colors } from '@/constants/Colors';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { child, onValue, runTransaction, update } from 'firebase/database';
import dbRootRef, { ServerType } from '@/utils/firebase';
import { router } from 'expo-router';
import { words } from '@/constants/constants';


export default function multiplayer() {

  const {amIHost, playerName, dbRefName, answers, numberOfGame} = useSelector((state: RootState) => state.player)


  const [points, setPoints] = useState<Record<string, number>>({})

  const results = useMemo(() => {
    return answers.map(answer => <Text key={answer} style={styles.wordLetter} >{words[answer]}</Text>)
  },[answers])

  function onPressMenu() {
    router.navigate('')
  }

  useEffect(() => {

    const unsubscribe = onValue(child(dbRootRef, dbRefName), snapshot => {
      if(snapshot.exists()){
        const data: ServerType = snapshot.val()
        setPoints(data.points)
      }
      else{
        router.navigate('serverBrowser')
      }
    })

    return unsubscribe
  }, [])

  return (
    <View style={styles.main}>
      <View style={{alignItems: 'flex-start'}}>
      <Pressable style={{backgroundColor: colors.white, paddingBottom: 4, paddingHorizontal: 8, borderRadius: 30}} onPress={onPressMenu}>
        <Text style={styles.backText}>{'< Menüye Dön '}</Text>
      </Pressable>
      </View>
      <View style={styles.pointList}>
        <Text style={styles.letter}>Puanlar  </Text>
        {
          Object.keys(points)
            .map(player => {
              return player === playerName ?
              <Text key={player} style={styles.selfLetter} >
                {`${player}: ${points[player]}`}
              </Text>
              :
              <Text key={player} style={styles.letter} >
                {`${player}: ${points[player]}`}
              </Text>
            })
        }
      </View>
      <View style={styles.wordList}>
        <Text style={styles.wordLetter}>Kelimeler</Text>
        {results}
      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  main: {
    flex: 1,
    backgroundColor: colors.black,
    padding: 16,
  },

  pointList: {
    marginHorizontal: 'auto',
    paddingTop: 8,
  },

  wordList:{
    marginTop: 16,
    marginHorizontal: 'auto',
  },

  letter: {
    color: colors.white,
    fontWeight : '600',
    fontSize: 30
  },

  selfLetter: {
    color: colors.green,
    fontWeight : '600',
    fontSize: 30
  },

  wordLetter: {
    color: colors.lightGray,
    fontWeight : '600',
    fontSize: 30
  },

  backText: {
    color: colors.black,
    fontWeight : '600',
    fontSize: 20
  },

});