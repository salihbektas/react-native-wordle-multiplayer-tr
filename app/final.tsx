import {
  BackHandler,
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { colors } from '@/constants/Colors';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { child, off, onValue, remove } from 'firebase/database';
import dbRootRef, { ServerType } from '@/utils/firebase';
import { router, useFocusEffect } from 'expo-router';
import { words } from '@/constants/constants';
import updatedWords from '../assets/updatedWords.json';
import ThemedText from '@/components/ThemedText';
import ButtonText from '@/components/ButtonText';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';

export default function multiplayer() {
  const { amIHost, playerName, dbRefName, answers } = useSelector(
    (state: RootState) => state.player,
  );

  const [points, setPoints] = useState<Record<string, number>>({});
  const colorScheme = useColorScheme();
  const { background, text } = colors[colorScheme ?? 'dark'];

  const results = useMemo(() => {
    return answers.map((answer) => (
      <Pressable
        key={answer}
        style={styles.linkContainer}
        onPress={() =>
          WebBrowser.openBrowserAsync(
            `http://sozluk.gov.tr/?ara=${updatedWords[answer].toLocaleLowerCase('tr')}`,
          )
        }
      >
        <ThemedText style={[styles.wordLetter, { marginRight: 14 }]}>
          {updatedWords[answer]}
        </ThemedText>
        <Ionicons name='search-circle-outline' size={32} color={text} />
      </Pressable>
    ));
  }, [answers]);

  function onPressMenu() {
    if (amIHost) {
      remove(child(dbRootRef, dbRefName));
    }
    router.navigate('./');
  }

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        onPressMenu();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  useEffect(() => {
    const unsubscribe = onValue(child(dbRootRef, dbRefName), (snapshot) => {
      if (snapshot.exists()) {
        const data: ServerType = snapshot.val();
        setPoints(data.points);
      } else {
        off(child(dbRootRef, dbRefName));
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={[styles.main, { backgroundColor: background }]}>
      <View style={styles.top}>
        <Pressable style={styles.button} onPress={onPressMenu}>
          <Image
            source={require('../assets/images/back.png')}
            style={styles.icon}
          />
          <ButtonText style={styles.backText}>{'Menüye Dön '}</ButtonText>
        </Pressable>
      </View>
      <View style={styles.pointList}>
        <ThemedText style={styles.letter}>Puanlar </ThemedText>
        {Object.keys(points)
          .sort((p1, p2) => points[p2] - points[p1])
          .map((player) => {
            return player === playerName ? (
              <ThemedText key={player} style={styles.selfLetter}>
                {`${player}: ${points[player]}`}
              </ThemedText>
            ) : (
              <ThemedText key={player} style={styles.letter}>
                {`${player}: ${points[player]}`}
              </ThemedText>
            );
          })}
      </View>
      <View style={styles.wordList}>
        <ThemedText style={styles.wordLetter}>Kelimeler</ThemedText>
        {results}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.black,
    padding: 16,
  },

  top: { alignItems: 'flex-start' },

  button: {
    backgroundColor: colors.darkGray,
    flexDirection: 'row',
    paddingBottom: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  icon: {
    resizeMode: 'contain',
    height: 24,
    width: 24,
    marginTop: 3,
    tintColor: colors.white,
  },

  pointList: {
    marginHorizontal: 'auto',
    paddingTop: 8,
  },

  wordList: {
    marginTop: 16,
    marginHorizontal: 'auto',
  },

  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colors.white,
    borderBottomWidth: 1,
  },

  letter: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 30,
  },

  selfLetter: {
    color: colors.green,
    fontWeight: '600',
    fontSize: 30,
  },

  wordLetter: {
    color: colors.lightGray,
    fontWeight: '600',
    fontSize: 30,
  },

  backText: {
    color: colors.black,
    fontWeight: '600',
    fontSize: 20,
  },
});
