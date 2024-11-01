import ButtonText from '@/components/ButtonText';
import CheckBox from '@/components/CheckBox';
import Keyboard from '@/components/Keyboard';
import ThemedText from '@/components/ThemedText';
import { colors } from '@/constants/Colors';
import { changeKeyboardLayout } from '@/features/playerSlice/playerSlice';
import { RootState } from '@/store/store';
import { router } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Pressable,
  useColorScheme,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function settings() {
  const colorScheme = useColorScheme();
  const { background } = colors[colorScheme ?? 'dark'];

  const { keyboardLayout } = useSelector((state: RootState) => state.player);

  const dispatch = useDispatch();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <Pressable
          style={styles.button}
          onPress={() => router.navigate('./setting')}
        >
          <Image
            source={require('../assets/images/back.png')}
            style={[styles.icon, { tintColor: colors.white }]}
          />
          <ButtonText style={styles.backText}>{'Ayarlara Dön '}</ButtonText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>Klayve Düzeni</ThemedText>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <Pressable
              style={[styles.rowWrapper, styles.rowFirst]}
              onPress={() => {
                dispatch(changeKeyboardLayout('seperate'));
              }}
            >
              <View style={styles.row}>
                <ThemedText style={styles.rowLabel}>Ayrık</ThemedText>

                <View style={styles.rowSpacer} />

                <CheckBox size={25} value={keyboardLayout === 'seperate'} />
              </View>
            </Pressable>

            <Pressable
              style={styles.rowWrapper}
              onPress={() => {
                dispatch(changeKeyboardLayout('flat'));
              }}
            >
              <View style={styles.row}>
                <ThemedText style={styles.rowLabel}>Düz</ThemedText>

                <View style={styles.rowSpacer} />

                <CheckBox size={25} value={keyboardLayout === 'flat'} />
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: 'auto' }}>
        <ThemedText
          style={[
            styles.rowLabel,
            { fontSize: 24, marginLeft: 8, marginBottom: 8 },
          ]}
        >
          Önizleme
        </ThemedText>
        <Keyboard
          onPressDel={() => {}}
          onPressEnter={() => {}}
          grayLetters={['A', 'V', 'T', 'F', 'Ş', 'Ç', 'O', 'P', 'L', 'H']}
          greenLetters={['E', 'Y', 'M']}
          onPressLetter={() => {}}
          yellowLetters={['K', 'S']}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  icon: {
    resizeMode: 'contain',
    height: 24,
    width: 24,
    marginTop: 3,
  },
  /** Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  button: {
    backgroundColor: colors.darkGray,
    flexDirection: 'row',
    paddingBottom: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'center',
  },
  backText: {
    fontWeight: '600',
    fontSize: 20,
  },
  /** Section */
  section: {
    paddingTop: 12,
  },
  sectionBody: {
    paddingLeft: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.darkGray,
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 16,
    height: 50,
  },
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: colors.darkGray,
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: '500',
    marginRight: 4,
  },

  input: {
    fontSize: 17,
  },
});
