import { colors } from '@/constants/Colors';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  TextInput,
  Alert,
  Platform,
  useColorScheme,
} from 'react-native';
import { update, runTransaction, child } from 'firebase/database';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  addDBRefName,
  addName,
  makeHost,
  makePlayer,
} from '@/features/playerSlice/playerSlice';
import dbRootRef, { ServerType } from '@/utils/firebase';
import useFirebase from '@/hooks/useFirebase';
import ThemedText from '@/components/ThemedText';
import ButtonText from '@/components/ButtonText';
import { RootState } from '@/store/store';

export default function serverBrowser() {
  const { isLoading, serverList, refreshServerList } = useFirebase();
  const { playerName: storedPlayerName } = useSelector(
    (state: RootState) => state.player,
  );
  const [playerName, setPlayerName] = useState<string>(storedPlayerName);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const { background } = colors[colorScheme ?? 'dark'];

  useEffect(() => {
    refreshServerList();
    const interval = setInterval(refreshServerList, 3000);
    return () => clearInterval(interval);
  }, []);

  function createServer() {
    if (playerName === '') {
      Platform.OS === 'web'
        ? alert('İsim girmediniz. Oda kurmak için isiminiz gerekli.')
        : Alert.alert('İsim girmediniz', 'Oda kurmak için isiminiz gerekli.', [
            { text: 'Tamam' },
          ]);
      return;
    }
    const points: Record<string, number> = {};
    points[playerName] = 0;
    const result: Record<string, [number, number]> = {};
    result[`${playerName}`] = [0, 0];
    const updates: Record<string, unknown> = {};
    updates[`${playerName} oyun odası`] = {
      serverName: playerName,
      isWaiting: true,
      playerCount: 1,
      playerList: [playerName],
      turn: 0,
      results: result,
      points,
    };
    update(dbRootRef, updates).then(() => {
      dispatch(makeHost());
      if (playerName !== '') dispatch(addName(playerName));
      dispatch(addDBRefName(`/${playerName} oyun odası`));
      router.navigate('./lobby');
    });
  }

  function joinServer(serverName: string) {
    if (playerName === '') {
      Platform.OS === 'web'
        ? alert('İsim girmediniz. Oyuna katılmak için isiminiz gerekli.')
        : Alert.alert(
            'İsim girmediniz',
            'Oyuna katılmak için isiminiz gerekli.',
            [{ text: 'Tamam' }],
          );
      return;
    }

    runTransaction(
      child(dbRootRef, `/${serverName} oyun odası`),
      (serverState: ServerType) => {
        if (serverState) {
          serverState.playerCount++;
          serverState.playerList.push(playerName);
          const update: Record<string, [number, number]> = {};
          update[`${playerName}`] = [0, 0];
          serverState.results = { ...serverState.results, ...update };
          serverState.points[playerName] = 0;
        }
        return serverState;
      },
    ).then(() => {
      dispatch(makePlayer());
      if (playerName !== '') dispatch(addName(playerName));
      dispatch(addDBRefName(`/${serverName} oyun odası`));
      router.navigate('./lobby');
    });
  }

  return (
    <View style={[styles.main, { backgroundColor: background }]}>
      <ThemedText style={styles.text}>Çok Oyuncu</ThemedText>

      {storedPlayerName === '' ? (
        <TextInput
          style={styles.input}
          onChangeText={setPlayerName}
          value={playerName}
          placeholder='oyuncu ismi'
          placeholderTextColor={colors.white}
        />
      ) : null}

      <ThemedText style={styles.text}>Sunucu Listesi</ThemedText>

      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator
            size={'large'}
            style={styles.loading}
            color={colors.green}
          />
        ) : serverList.length === 0 ? (
          <ThemedText style={styles.noServerText}>Sunucu Yok</ThemedText>
        ) : (
          serverList.map((server, index) => (
            <View key={index} style={styles.listRow}>
              <ThemedText
                style={styles.text}
              >{`${server.serverName}   ${server.playerCount}`}</ThemedText>
              <Pressable
                style={styles.button}
                onPress={() => {
                  joinServer(server.serverName);
                }}
              >
                <ButtonText style={styles.buttonText}>Katıl</ButtonText>
              </Pressable>
            </View>
          ))
        )}
      </View>

      <Pressable style={styles.button} onPress={createServer}>
        <ButtonText style={styles.buttonText}>Oyun Kur</ButtonText>
      </Pressable>

      <Pressable style={styles.button} onPress={refreshServerList}>
        <ButtonText style={styles.buttonText}>Yenile</ButtonText>
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
    fontSize: 30,
  },

  input: {
    backgroundColor: colors.darkGray,
    padding: 8,
    borderRadius: 8,
    color: colors.white,
    fontSize: 30,
    marginVertical: 4,
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

  loading: {
    margin: 'auto',
  },

  noServerText: {
    fontSize: 30,
    margin: 'auto',
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
