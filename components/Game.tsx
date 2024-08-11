import { useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Animated, {useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay} from 'react-native-reanimated'
import { colors } from '@/constants/Colors';
import { words } from '../constants/constants'
import useInterval from 'use-interval';
import Keyboard from './Keyboard';


type TileColors = 'black' | 'yellow' | 'lightGray' | 'darkGray' | 'green'

type StateType = {
  data: string[];
  colors: TileColors[][];
  row: number;
}

const BoxStyle = (color: TileColors) => {
  return StyleSheet.create({
    box: {
    width: '19%',
    height: '100%',
    borderColor: color === 'black' ? colors.darkGray : colors[color],
    backgroundColor: colors[color],
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  }})
}


type propType = {
  answerIndex: number;
  isPlaying: boolean;
  setIsPlaying: (param:boolean) => void;
  time: number;
  setTime: (param: number | ((param: number) => number) ) => void;
  setAttempts: (param: number) => void;
}

export default function Game({
  answerIndex,
  isPlaying,
  setIsPlaying,
  time,
  setTime,
  setAttempts
}: propType) {
  
  const [state, setState] = useState<StateType>({data: ['','','','','',''],colors:[['black','black','black','black','black'],['black','black','black','black','black'],['black','black','black','black','black'],['black','black','black','black','black'],['black','black','black','black','black'],['black','black','black','black','black']], row: 0})

  const [grayLetters, setGrayLetters] = useState<string[]>([])
  const [yellowLetters, setYellowLetters] = useState<string[]>([])
  const [greenLetters, setGreenLetters] = useState<string[]>([])
  const [now, setNow] = useState(Date.now)

  useInterval(() => {

    setTime(180 - Math.trunc((Date.now() - now)/1000))

    if(time === 1 && isPlaying){
      setIsPlaying(false)
      Toast.show({
        type: 'error',
        text1: `Kelime: ${words[answerIndex]}`,
        autoHide: true,
        visibilityTime : 4000,
      })
      
    }  
  },  time > 0 ? 1000 : null)

  function onPressLetter(letter: string) {
    if(!isPlaying)
      return;

    if(state.data[state.row].length < 5){
      const newState = {...state}
      newState.data[state.row] += letter
      setState(newState)
    }
  }

  function onPressEnter(){
    if(!isPlaying)
      return;

    if(!words.some((word: string) => word === state.data[state.row])){
      Toast.show({
        type: 'info',
        text1: 'Kelime Yok',
        visibilityTime: 4000
      })
      return
    }

    if(state.data[state.row].length === 5 && state.row < 6){
      const newState = {...state}
      let yellow = [...yellowLetters]
      let green = [...greenLetters]
      let gray = [...grayLetters]

      for(let i = 0; i < 5; ++i){
        if(newState.data[newState.row].charAt(i) === words[answerIndex].charAt(i)){
          newState.colors[newState.row][i] = 'green'
          green = [...green, words[answerIndex].charAt(i)]
        }
      }

      let yellowed = [false, false, false, false, false]
      for(let i = 0; i < 5; ++i){
        if(newState.colors[newState.row][i] !== 'green'){
          
          for (let j = 0; j < 5; ++j) {
            if(newState.data[newState.row].charAt(i) === words[answerIndex].charAt(j) && newState.colors[newState.row][j] !== 'green' && !yellowed[j]){
              yellowed[j] = true
              newState.colors[newState.row][i] = 'yellow'
              yellow = [...yellow, newState.data[newState.row].charAt(i)]
              break
            }
          }
          if(newState.colors[newState.row][i] !== 'yellow'){
            newState.colors[newState.row][i] = 'darkGray'
            gray = [...gray, newState.data[newState.row].charAt(i)]
          }
        }
      }

      setTimeout(() => {
        setYellowLetters(yellow)
        setGreenLetters(green)
        setGrayLetters(gray)
      }, 1750)

      if(newState.colors[newState.row].every(color => color === 'green')){
        setIsPlaying(false)
        Toast.show({
          text1: 'Tebrikler',
          visibilityTime: 4000,
        })
      }
      else
        newState.row += 1

      setState(newState)
      setAttempts(newState.row)

      if(newState.row > 5){
        setIsPlaying(false)
        Toast.show({
          type: 'error',
          text1: `Kelime: ${words[answerIndex]}`,
          visibilityTime: 4000,
        })
      }
    }
  }

  function onPressDel(){
    if(!isPlaying)
      return;
  
    if(state.data[state.row].length > 0){
      const newState = {...state}
      newState.data[state.row] = newState.data[state.row].slice(0,-1)
      setState(newState)
    }
  }


  return (
    <View style={styles.container}>

      <View style={styles.top}>
        <Text style={[styles.letter, {fontSize: 24}]}>WORDLE TÜRKÇE</Text>
        <Text style={[styles.letter, {fontSize: 24}]}>{time >= 0 ? `${Math.floor(time/60)}:${String(time%60).padStart(2, '0')}` : '0:00'}</Text>
      </View>

      <View style={styles.board}>
        {[0,1,2,3,4,5].map(row => {
          return(
            <View style={styles.boardRow} key={row}>
              {[0,1,2,3,4].map(column => {
                return(
                  <Tile key={answerIndex*10 + column} letter={state.data[row].charAt(column)} color={state.colors[row][column]} order={column} />
                )
              })}
            </View>
          )
        })}
      </View>

      <Keyboard 
        onPressDel={onPressDel}
        onPressEnter={onPressEnter}
        onPressLetter={onPressLetter}
        greenLetters={greenLetters}
        yellowLetters={yellowLetters}
        grayLetters={grayLetters}
      />

    </View>
  );

}


function Tile({color, letter, order}: {color: TileColors; letter: string; order: number}) {

  const oldColor = useRef('black')
  const sh = useSharedValue({deg: 0, color:colors.black})

  if(color !== oldColor.current){
    oldColor.current = color
    sh.value = withDelay(order*350, withSequence(withTiming({deg: 90, color:color === 'black' ? colors.darkGray : colors[color]}, {duration: 175}), withTiming({deg: 270, color:colors[color]}, {duration: 0}), withTiming({deg: 360, color:colors[color]}, {duration: 175}))) 
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {transform: [{rotateX: `${sh.value.deg}deg`}],
            backgroundColor: sh.value.color,
            borderColor: sh.value.color === colors.black ? colors.darkGray : sh.value.color}
  })

  return(
    <Animated.View style={[BoxStyle(color).box, animatedStyle]}>
      <Text style={styles.letter2} selectable={false}>{letter}</Text>
    </Animated.View>
  )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    paddingBottom: 40,
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

  top:{
    marginVertical: 16,
    flexDirection: 'row',
    maxWidth: 500,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center'
  },

  board: {
    width: Platform.OS === 'web' ? Dimensions.get('screen').height *0.45 :  Dimensions.get('screen').width *0.8,
    height: Platform.OS === 'web' ? Dimensions.get('screen').height *0.6 : Dimensions.get('screen').width *0.96,
    marginVertical: 'auto',
    justifyContent: 'space-between'
  },

  boardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '16%',
  },

  letter: {
    color: colors.white,
    fontWeight : '600',
    fontSize: 12
  },

  letter2: {
    color: colors.white,
    fontWeight : 'bold',
    fontSize: 30
  },

});