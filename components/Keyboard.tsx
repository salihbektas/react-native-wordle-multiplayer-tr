import { colors } from '@/constants/Colors';
import { RootState } from '@/store/store';
import { AntDesign, Feather } from '@expo/vector-icons';
import { memo, useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useSelector } from 'react-redux';

const letters = [
  ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
  ['ENTER', 'Z', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', 'DEL'],
];

type propType = {
  onPressDel: () => void;
  onPressEnter: () => void;
  onPressLetter: (letter: string) => void;
  greenLetters: string[];
  yellowLetters: string[];
  grayLetters: string[];
};

export default memo(function Keyboard({
  onPressDel,
  onPressEnter,
  onPressLetter,
  greenLetters,
  yellowLetters,
  grayLetters,
}: propType) {
  const { keyboardLayout } = useSelector((state: RootState) => state.player);

  const colorScheme = useColorScheme();
  const { background } = colors[colorScheme ?? 'dark'];

  useEffect(() => {
    function keyDownHandler(e: KeyboardEvent) {
      e.preventDefault();
      const key =
        e.key === 'ı' ? 'I' : e.key === 'i' ? 'İ' : e.key.toUpperCase();

      if (key === 'ENTER') {
        onPressEnter();
      } else if (key === 'BACKSPACE') {
        onPressDel();
      } else if (
        letters[0].includes(key) ||
        letters[1].includes(key) ||
        letters[2].includes(key)
      ) {
        onPressLetter(key);
      }
    }

    Platform.OS === 'web' &&
      document.addEventListener('keydown', keyDownHandler);

    return () => {
      Platform.OS === 'web' &&
        document.removeEventListener('keydown', keyDownHandler);
    };
  }, [onPressDel, onPressLetter, onPressDel]);

  return (
    <View
      style={keyboardLayout === 'flat' ? styles.flatKeyboard : styles.keyboard}
    >
      <View
        style={
          keyboardLayout === 'flat'
            ? styles.flatKeyboardRow
            : styles.keyboardRow
        }
      >
        {letters[0].map((item) => (
          <TouchableOpacity
            style={[
              keyboardLayout === 'flat'
                ? styles.flatLetterBox
                : styles.letterBox,
              {
                borderColor: background,
                backgroundColor: greenLetters.includes(item)
                  ? colors.green
                  : yellowLetters.includes(item)
                    ? colors.yellow
                    : grayLetters.includes(item)
                      ? colors.darkGray
                      : colors.lightGray,
              },
            ]}
            onPress={() => onPressLetter(item)}
            key={item}
          >
            <Text style={styles.letter} selectable={false}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={
          keyboardLayout === 'flat'
            ? styles.flatKeyboardRow
            : [styles.keyboardRow, { width: '93%' }]
        }
      >
        {letters[1].map((item) => (
          <TouchableOpacity
            style={[
              keyboardLayout === 'flat'
                ? styles.flatLetterBox
                : styles.letterBox,
              {
                borderColor: background,
                backgroundColor: greenLetters.includes(item)
                  ? colors.green
                  : yellowLetters.includes(item)
                    ? colors.yellow
                    : grayLetters.includes(item)
                      ? colors.darkGray
                      : colors.lightGray,
              },
            ]}
            onPress={() => onPressLetter(item)}
            key={item}
          >
            <Text style={styles.letter} selectable={false}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={
          keyboardLayout === 'flat'
            ? styles.flatKeyboardRow
            : styles.keyboardRow
        }
      >
        {letters[2].map((item) => {
          if (item === 'ENTER')
            return (
              <TouchableOpacity
                style={[
                  keyboardLayout === 'flat'
                    ? [styles.flatLetterBox, { borderColor: background }]
                    : styles.letterBox,
                  { flex: 3 },
                ]}
                onPress={onPressEnter}
                key={item}
              >
                <AntDesign name='enter' size={20} color={colors.white} />
              </TouchableOpacity>
            );
          if (item === 'DEL')
            return (
              <TouchableOpacity
                style={[
                  keyboardLayout === 'flat'
                    ? [styles.flatLetterBox, { borderColor: background }]
                    : styles.letterBox,
                  { flex: 3 },
                ]}
                onPress={onPressDel}
                key={item}
              >
                <Feather name='delete' size={20} color={colors.white} />
              </TouchableOpacity>
            );

          return (
            <TouchableOpacity
              style={[
                keyboardLayout === 'flat'
                  ? styles.flatLetterBox
                  : styles.letterBox,
                {
                  borderColor: background,
                  backgroundColor: greenLetters.includes(item)
                    ? colors.green
                    : yellowLetters.includes(item)
                      ? colors.yellow
                      : grayLetters.includes(item)
                        ? colors.darkGray
                        : colors.lightGray,
                },
              ]}
              onPress={() => onPressLetter(item)}
              key={item}
            >
              <Text style={styles.letter} selectable={false}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  keyboard: {
    marginTop: 4,
    paddingHorizontal: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    aspectRatio: 5 / 2,
  },

  keyboardRow: {
    flexDirection: 'row',
    height: '33%',
    width: '100%',
    gap: 6,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  letterBox: {
    height: '90%',
    flex: 2,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },

  letter: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 12,
  },

  flatKeyboard: {
    marginTop: 4,
    width: '100%',
    maxWidth: 500,
    aspectRatio: 5 / 2,
  },

  flatKeyboardRow: {
    flex: 1,
    flexDirection: 'row',
  },

  flatLetterBox: {
    flex: 2,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
