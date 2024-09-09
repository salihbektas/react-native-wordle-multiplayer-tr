import { colors } from '@/constants/Colors';
import { useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

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

export default function Keyboard({
  onPressDel,
  onPressEnter,
  onPressLetter,
  greenLetters,
  yellowLetters,
  grayLetters,
}: propType) {
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
    <View style={styles.keyboard}>
      <View style={styles.keyboardRow}>
        {letters[0].map((item) => (
          <TouchableOpacity
            style={[
              styles.letterBox,
              {
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
      <View style={[styles.keyboardRow, { width: '93%' }]}>
        {letters[1].map((item) => (
          <TouchableOpacity
            style={[
              styles.letterBox,
              {
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
      <View style={styles.keyboardRow}>
        {letters[2].map((item) => {
          if (item === 'ENTER')
            return (
              <TouchableOpacity
                style={[styles.letterBox, { flex: 3 }]}
                onPress={onPressEnter}
                key={item}
              >
                <Text style={styles.letter} selectable={false}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          if (item === 'DEL')
            return (
              <TouchableOpacity
                style={[styles.letterBox, { flex: 3 }]}
                onPress={onPressDel}
                key={item}
              >
                <Text style={styles.letter} selectable={false}>
                  {item}
                </Text>
              </TouchableOpacity>
            );

          return (
            <TouchableOpacity
              style={[
                styles.letterBox,
                {
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
}

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
});
