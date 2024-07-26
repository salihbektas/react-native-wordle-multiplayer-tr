import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Animated, {useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay} from 'react-native-reanimated'
import { colors } from '@/constants/Colors';
import { words } from '../constants/constants'
import useInterval from 'use-interval';


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

const letters=[
  ['E','R','T','Y','U','I','O','P','Ğ','Ü'],
  ['A','S','D','F','G','H','J','K','L','Ş','İ'],
  ['ENTER','Z','C','V','B','N','M','Ö','Ç','DEL']
]



type propType = {
  answerIndex: number;
  isPlaying: boolean;
  setIsPlaying: (param:boolean) => void;
  time: number;
  setTime: (param: (param: number) => number) => void;
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

  useInterval(() => {
    if(time > -2){
      setTime(t => t-1)
    }
    else{
      setIsPlaying(false)
    }
    if(time === 0){
      Toast.show({
        text1: `Kelime: ${words[answerIndex]}`,
        autoHide: true,
        visibilityTime : 2000,
      })
      
    }  
  },  isPlaying ? 1000 : null)

  useEffect(() => {
    function keyDownHandler(e: KeyboardEvent) {
      e.preventDefault();
      const key = e.key === 'ı' ? 'I' : e.key === 'i' ? 'İ' : e.key.toUpperCase()
      
      if(key === 'ENTER'){
        onPressEnter()
      }
      else if(key === 'BACKSPACE'){
        onPressDel()
      }
      else if(letters[0].includes(key) || letters[1].includes(key) || letters[2].includes(key)){
        onPressLetter(key)
      }
    }

    Platform.OS === 'web' && document.addEventListener("keydown", keyDownHandler);

    return () => {
      Platform.OS === 'web' && document.removeEventListener("keydown", keyDownHandler);
    };
  }, [state]);


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
        text1: 'Kelime Yok',
        visibilityTime: 2000
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
          visibilityTime: 2000,
        })
      }
      else
        newState.row += 1

      setState(newState)
      setAttempts(newState.row)

      if(newState.row > 5){
        setIsPlaying(false)
        Toast.show({
          text1: `Kelime: ${words[answerIndex]}`,
          visibilityTime: 2000,
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

      <View style={styles.keyboard}>
        <View style={styles.keyboardRow}>
          {letters[0].map(item => <Pressable style={[styles.letterBox, {backgroundColor: greenLetters.includes(item) ? colors.green : yellowLetters.includes(item) ? colors.yellow : grayLetters.includes(item) ? colors.darkGray : colors.lightGray}]} onPress={() => onPressLetter(item)} key={item} ><Text style={styles.letter} selectable={false}>{item}</Text></Pressable>)}
        </View>
        <View style={[styles.keyboardRow,{width: '93%'}]}>
          {letters[1].map(item => <Pressable style={[styles.letterBox, {backgroundColor: greenLetters.includes(item) ? colors.green : yellowLetters.includes(item) ? colors.yellow : grayLetters.includes(item) ? colors.darkGray : colors.lightGray}]} onPress={() => onPressLetter(item)} key={item} ><Text style={styles.letter} selectable={false}>{item}</Text></Pressable>)}
        </View>
        <View style={styles.keyboardRow}>
          {letters[2].map(item => {
            if(item === 'ENTER')
              return <Pressable style={[styles.letterBox, {flex: 3}]} onPress={onPressEnter} key={item} ><Text style={styles.letter} selectable={false}>{item}</Text></Pressable>
            if(item === 'DEL')
              return <Pressable style={[styles.letterBox, {flex: 3}]} onPress={onPressDel} key={item} ><Text style={styles.letter} selectable={false}>{item}</Text></Pressable>
            
            return <Pressable style={[styles.letterBox, {backgroundColor: greenLetters.includes(item) ? colors.green : yellowLetters.includes(item) ? colors.yellow : grayLetters.includes(item) ? colors.darkGray : colors.lightGray}]} onPress={() => onPressLetter(item)} key={item} ><Text style={styles.letter} selectable={false}>{item}</Text></Pressable>
          })
            
          }
        </View>
      </View>

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
    maxWidth: 320,
    width: '100%',
    aspectRatio: 5/6,
    marginVertical: 'auto',
    justifyContent: 'space-between',

  },

  boardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '16%',
  },

  keyboard:{
    marginTop: 4,
    paddingHorizontal: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 200,
    width: '100%',
    maxWidth: 500,
  },

  keyboardRow: {
    flexDirection: 'row',
    height: '33%',
    width: '100%',
    gap: 6,
    justifyContent: 'space-around',
    alignItems: 'center'
  },

  letterBox:{
    height: '90%',
    flex: 2,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center'
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