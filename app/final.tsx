import { Image, Pressable, StyleSheet, Text, View} from 'react-native';
import { colors } from '@/constants/Colors';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { child, onValue, remove } from 'firebase/database';
import dbRootRef, { ServerType } from '@/utils/firebase';
import { router } from 'expo-router';
import { words } from '@/constants/constants';


export default function multiplayer() {

  const {amIHost, playerName, dbRefName, answers} = useSelector((state: RootState) => state.player)


  const [points, setPoints] = useState<Record<string, number>>({})

  const results = useMemo(() => {
    return answers.map(answer => <Text key={answer} style={styles.wordLetter} >{words[answer]}</Text>)
  },[answers])

  function onPressMenu() {
    if(amIHost){
      remove(child(dbRootRef, dbRefName))
    }
    router.navigate('./')
  }

  useEffect(() => {
    const unsubscribe = onValue(child(dbRootRef, dbRefName), snapshot => {
      if(snapshot.exists()){
        const data: ServerType = snapshot.val()
        setPoints(data.points)
      }
    })

    return unsubscribe
  }, [])

  return (
    <View style={styles.main}>
      <View style={styles.top}>
        <Pressable style={styles.button} onPress={onPressMenu}>
          <Image source={require('../assets/images/back.png')} style={styles.icon} />
          <Text style={styles.backText}>{'Menüye Dön '}</Text>
        </Pressable>
      </View>
      <View style={styles.pointList}>
        <Text style={styles.letter}>Puanlar  </Text>
        {
          Object.keys(points)
            .sort((p1, p2) => points[p2] - points[p1])
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

  top: {alignItems: 'flex-start'},

  button: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingBottom: 4,
    paddingHorizontal: 8,
    borderRadius: 8
  },

  icon: {
    resizeMode: 'contain',
    height: 24,
    width: 24,
    marginTop: 3,
    tintColor: colors.black,
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