import { colors } from '@/constants/Colors';
import { RootState } from '@/store/store';
import dbRootRef, { ServerType } from '@/utils/firebase';
import { router } from 'expo-router';
import {
  child,
  off,
  onValue,
  remove,
  runTransaction,
  update,
} from 'firebase/database';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import updatedWords from '../assets/updatedWords.json';
import { addWords } from '@/features/playerSlice/playerSlice';
import ThemedText from '@/components/ThemedText';
import ButtonText from '@/components/ButtonText';

const defaultConfigs = {
  time: 180,
  wordsCount: 5,
};

export default function lobby() {
  const { amIHost, playerName, dbRefName } = useSelector(
    (state: RootState) => state.player,
  );
  const dispatch = useDispatch();

  const [playerList, setPlayerList] = useState<string[]>([]);

  const colorScheme = useColorScheme();
  const { background, text } = colors[colorScheme ?? 'dark'];

  function start() {
    const updates = { isWaiting: false };
    update(child(dbRootRef, dbRefName), updates);
  }

  useEffect(() => {
    const dbRef = child(dbRootRef, dbRefName);

    if (amIHost) {
      let i = 0;
      const tempAnswerIndexes: number[] = [];
      do {
        const answerIndexes = Math.floor(Math.random() * updatedWords.length);
        if (
          !tempAnswerIndexes.some((answer) => {
            answer === answerIndexes;
          })
        ) {
          tempAnswerIndexes.push(answerIndexes);
          ++i;
        }
      } while (i < defaultConfigs.wordsCount);

      const updates = { answers: tempAnswerIndexes };
      update(dbRef, updates);
    }

    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (
          !(data.playerList as string[]).find(
            (playerNameInList) => playerName === playerNameInList,
          )
        ) {
          off(dbRef);
          router.back();
        }
        setPlayerList(data.playerList);
        dispatch(addWords(data.answers));

        if (!data.isWaiting) {
          router.navigate('./multiplayer');
        }
      } else {
        router.back();
      }
    });

    return unsubscribe;
  }, []);

  function disconnect() {
    const dbRef = child(dbRootRef, dbRefName);
    if (amIHost) {
      remove(dbRef);
    } else {
      runTransaction(dbRef, (serverState: ServerType) => {
        if (serverState) {
          serverState.playerCount--;
          serverState.playerList = serverState.playerList.filter(
            (playerNameOnList) => playerName !== playerNameOnList,
          );
          delete serverState.results[playerName];
          delete serverState.points[playerName];
        }
        return serverState;
      }).then(() => {
        off(dbRef);
        router.back();
      });
    }
  }

  function kickPlayer(playerName: string) {
    function kick(params: string) {
      runTransaction(child(dbRootRef, dbRefName), (serverState: ServerType) => {
        if (serverState) {
          serverState.playerCount--;
          serverState.playerList = serverState.playerList.filter(
            (playerNameOnList) => params !== playerNameOnList,
          );
          delete serverState.results[params];
          delete serverState.points[params];
        }
        return serverState;
      });
    }

    if (
      Platform.OS === 'web' &&
      confirm(`${playerName} oyuncusunu atmak istiyormusunuz ?`)
    ) {
      kick(playerName);
    } else {
      Alert.alert(`${playerName} oyuncusunu atmak istiyormusunuz ?`, '', [
        { text: 'Hayır', style: 'cancel' },
        {
          text: 'Evet',
          onPress: () => {
            kick(playerName);
          },
        },
      ]);
    }
  }

  return (
    <View style={[styles.main, { backgroundColor: background }]}>
      <ThemedText style={styles.text}>Oyun Lobisi</ThemedText>

      <ThemedText style={styles.text}>Oyuncu Listesi</ThemedText>

      <View style={styles.listContainer}>
        <ThemedText style={styles.text}>Oyuncular...</ThemedText>
        {playerList.map((playerNameInList, index) => (
          <View key={index} style={styles.listRow}>
            <ThemedText style={styles.text}>{playerNameInList}</ThemedText>
            {amIHost && playerName !== playerNameInList && (
              <Pressable
                onPress={() => {
                  kickPlayer(playerNameInList);
                }}
              >
                <Image
                  source={require('../assets/images/close.png')}
                  style={[styles.icon, { tintColor: text }]}
                />
              </Pressable>
            )}
          </View>
        ))}
      </View>

      {amIHost && (
        <Pressable
          style={styles.button}
          onPress={start}
          disabled={playerList.length < 2}
        >
          <ButtonText style={styles.buttonText}>Başlat</ButtonText>
        </Pressable>
      )}

      <Pressable style={styles.button} onPress={disconnect}>
        <ButtonText style={styles.buttonText}>
          {amIHost ? 'Odayı Dağıt' : 'Odadan Ayrıl'}
        </ButtonText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    padding: 16,
  },

  text: {
    color: colors.white,
    fontSize: 30,
  },

  listContainer: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: colors.darkGray,
  },

  listRow: {
    padding: 4,
    marginVertical: 2,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.darkGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  icon: {
    height: 36,
    width: 36,
    marginTop: 3,
    resizeMode: 'cover',
    tintColor: colors.white,
  },

  button: {
    backgroundColor: colors.darkGray,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },

  buttonText: {
    color: colors.black,
    fontSize: 24,
  },
});
