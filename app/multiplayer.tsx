import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { colors } from '@/constants/Colors';
import Game from '@/components/Game';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  child,
  increment,
  onValue,
  runTransaction,
  update,
} from 'firebase/database';
import dbRootRef, { ServerType } from '@/utils/firebase';
import { router } from 'expo-router';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ButtonText from '@/components/ButtonText';

type Tab = 'results' | 'scors';

function formatTime(param: number) {
  return param % 60 < 10
    ? `${Math.floor(param / 60)}:0${param % 60}`
    : `${Math.floor(param / 60)}:${param % 60}`;
}

export default function multiplayer() {
  const { amIHost, playerName, dbRefName, answers, numberOfGame } = useSelector(
    (state: RootState) => state.player,
  );

  const [turn, setTurn] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('results');

  const wordIndex = answers[turn];
  const [isPlaying, setIsPlaying] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [time, setTime] = useState(180);
  const [results, setResults] = useState<Record<string, [number, number]>>({
    initial: [0, 0],
  });
  const [points, setPoints] = useState<Record<string, number>>({});

  const width = useSharedValue(Dimensions.get('window').width * 0.75);
  const colorScheme = useColorScheme();
  const { background } = colors[colorScheme ?? 'dark'];

  useEffect(() => {
    const unsubscribe = onValue(child(dbRootRef, dbRefName), (snapshot) => {
      if (snapshot.exists()) {
        const data: ServerType = snapshot.val();
        setPoints(data.points);
        setResults(data.results);
      } else {
        router.navigate('./serverBrowser');
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const playerlist = Object.keys(results);
    if (playerlist.every((player) => results[player][0] !== 0)) {
      const newPoints = { ...points };

      playerlist.forEach((player) => {
        if (results[player][1] !== -1) {
          let order = 1;
          playerlist.forEach((player2) => {
            if (
              player !== player2 &&
              results[player2][1] !== -1 &&
              results[player][1] > results[player2][1]
            ) {
              ++order;
            } else if (
              player !== player2 &&
              results[player2][0] !== -1 &&
              results[player][1] === results[player2][1] &&
              results[player][0] > results[player2][0]
            ) {
              ++order;
            }
          });
          newPoints[player] += playerlist.length - order + 1;
        }
      });
      setPoints(newPoints);

      setTimeout(onPressNext, 8000);
      width.value = withTiming(0, { duration: 8000, easing: Easing.linear });
    }
  }, [results]);

  useEffect(() => {
    if (!isPlaying) {
      const resutl: [number, number] = [-1, -1];
      if (time > 0 && attempts < 6) {
        resutl[0] = attempts + 1;
        resutl[1] = 180 - time;
      }

      runTransaction(child(dbRootRef, dbRefName), (serverState: ServerType) => {
        const update: Record<string, [number, number]> = {};
        update[`${playerName}`] = resutl;
        serverState.results = { ...serverState.results, ...update };

        return serverState;
      });
    } else {
      setTimeout(() => {
        width.value = Dimensions.get('window').width * 0.75;
      }, 2000);
    }
  }, [isPlaying]);

  function onPressNext() {
    if (amIHost) {
      const playerlist = Object.keys(results);

      const newPoints = { ...points };

      playerlist.forEach((player) => {
        if (results[player][1] !== -1) {
          let order = 1;
          playerlist.forEach((player2) => {
            if (
              player !== player2 &&
              results[player2][1] !== -1 &&
              results[player][1] > results[player2][1]
            ) {
              ++order;
            } else if (
              player !== player2 &&
              results[player2][0] !== -1 &&
              results[player][1] === results[player2][1] &&
              results[player][0] > results[player2][0]
            ) {
              ++order;
            }
          });
          newPoints[player] += playerlist.length - order + 1;
        }
      });

      const newResults = { ...results };
      playerlist.forEach((player) => (newResults[player] = [0, 0]));
      const updates = {
        turn: increment(1),
        results: newResults,
        points: newPoints,
      };
      update(child(dbRootRef, dbRefName), updates);
    }

    if (turn === 4) {
      router.navigate('./final');
      return;
    }

    setActiveTab('results');
    setTurn((t) => t + 1);
    setTime(180);
    setIsPlaying(true);
  }

  return (
    <View style={styles.main}>
      <Modal visible={!isPlaying} animationType='fade' transparent={true}>
        <View style={styles.modal}>
          <View style={styles.tabContainer}>
            <Pressable
              style={[
                styles.tab,
                {
                  backgroundColor:
                    activeTab === 'results' ? colors.green : background,
                  borderTopLeftRadius: 16,
                },
              ]}
              onPress={() => setActiveTab('results')}
            >
              <ButtonText style={styles.tabText}>Sonuçlar</ButtonText>
            </Pressable>
            <Pressable
              style={[
                styles.tab,
                {
                  backgroundColor:
                    activeTab === 'scors' ? colors.green : background,
                  borderTopRightRadius: 16,
                },
              ]}
              onPress={() => setActiveTab('scors')}
            >
              <ButtonText style={styles.tabText}>Puanlar</ButtonText>
            </Pressable>
          </View>
          <View style={styles.list}>
            {activeTab === 'results'
              ? Object.keys(results)
                  .filter(
                    (player) =>
                      results[player][0] !== 0 && results[player][1] !== 0,
                  )
                  .map((player) => {
                    let text: string;
                    if (results[player][0] === -1) {
                      text = `${player}: Başarısız `;
                    } else {
                      text = `${player}: ${results[player][0]} / ${formatTime(results[player][1])}`;
                    }
                    return player === playerName ? (
                      <ButtonText key={player} style={styles.selfLetter}>
                        {text}
                      </ButtonText>
                    ) : (
                      <ButtonText key={player} style={styles.letter}>
                        {text}
                      </ButtonText>
                    );
                  })
              : Object.keys(points)
                  .sort((p1, p2) => points[p2] - points[p1])
                  .map((player) => {
                    return player === playerName ? (
                      <ButtonText key={player} style={styles.selfLetter}>
                        {`${player}: ${points[player]}`}
                      </ButtonText>
                    ) : (
                      <ButtonText key={player} style={styles.letter}>
                        {`${player}: ${points[player]}`}
                      </ButtonText>
                    );
                  })}
          </View>
          <ButtonText
            style={styles.feedbackText}
          >{`${turn + 1} / ${numberOfGame}`}</ButtonText>
          <Animated.View
            style={{ flex: 1, width, backgroundColor: colors.green }}
          />
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
    width: '75%',
    height: '75%',
    margin: 'auto',
    backgroundColor: colors.darkGray,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  tab: {
    flex: 1,
    justifyContent: 'center',
  },

  tabContainer: {
    flex: 2,
    flexDirection: 'row',
  },

  tabText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 30,
    marginHorizontal: 'auto',
  },

  list: {
    flex: 15,
    marginHorizontal: 'auto',
    paddingTop: 8,
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

  feedbackText: {
    flex: 2,
    marginHorizontal: 'auto',
    color: colors.white,
    fontWeight: '600',
    fontSize: 30,
  },
});
