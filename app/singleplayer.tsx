import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/Colors';
import Game from '@/components/Game';
import { useState } from 'react';
import { words, WORDSLENGTH } from '@/constants/constants';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

export default function App() {
  const [wordIndex, setWordIndex] = useState(
    Math.floor(Math.random() * WORDSLENGTH),
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [time, setTime] = useState(180);

  function onPressNext() {
    setWordIndex(Math.floor(Math.random() * WORDSLENGTH));
    setIsPlaying(true);
    setTime(180);
  }

  return (
    <View style={styles.main}>
      <Modal visible={!isPlaying} animationType='fade' transparent={true}>
        <View style={styles.modal}>
          <View style={styles.word}>
            <Text style={styles.letter}>{words[wordIndex]}</Text>
            <Pressable
              style={styles.linkContainer}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  `http://sozluk.gov.tr/?ara=${words[wordIndex].toLocaleLowerCase('tr')}`,
                )
              }
            >
              <Text style={styles.subLetter}>{'Türk Dil Kurumunda Ara'}</Text>
              <Ionicons
                name='search-circle-outline'
                size={20}
                color={colors.white}
              />
            </Pressable>
          </View>
          <Pressable style={styles.next} onPress={onPressNext}>
            <Text style={styles.button}>Sıradaki</Text>
          </Pressable>
        </View>
      </Modal>
      <Game
        key={wordIndex}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        answerIndex={wordIndex}
        time={time}
        setTime={setTime}
        setAttempts={setAttempts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
    height: '50%',
    margin: 'auto',
    backgroundColor: colors.darkGray,
    borderRadius: 16,
  },

  word: {
    alignItems: 'center',
    margin: 'auto',
  },

  next: {
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: colors.green,
    width: '100%',
    borderRadius: 16,
  },

  linkContainer: {
    flexDirection: 'row',
    borderBottomColor: colors.white,
    borderBottomWidth: 1,
  },

  letter: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 38,
  },

  subLetter: {
    color: colors.white,
    fontSize: 16,
    marginRight: 14,
  },

  button: {
    color: colors.white,
    fontSize: 24,
  },
});
