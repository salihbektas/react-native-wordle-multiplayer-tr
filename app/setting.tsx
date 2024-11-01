import ButtonText from '@/components/ButtonText';
import ThemedText from '@/components/ThemedText';
import { colors } from '@/constants/Colors';
import { addName } from '@/features/playerSlice/playerSlice';
import { RootState } from '@/store/store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Pressable,
  Appearance,
  Platform,
  useColorScheme,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function settings() {
  const colorScheme = useColorScheme();
  const [dark, setDark] = useState(colorScheme === 'dark');
  const { background, text } = colors[colorScheme ?? 'dark'];
  const inputRef = useRef<TextInput | null>(null);
  const { playerName: storedPlayerName, keyboardLayout } = useSelector(
    (state: RootState) => state.player,
  );
  const dispatch = useDispatch();
  const [playerName, setPlayerName] = useState<string>(storedPlayerName);

  function toggleDark(darkMode: boolean) {
    AsyncStorage.setItem('dark', String(darkMode));
    setDark(darkMode);
    if (Platform.OS !== 'web')
      Appearance.setColorScheme(darkMode ? 'dark' : 'light');
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <Pressable style={styles.button} onPress={() => router.navigate('./')}>
          <Image
            source={require('../assets/images/back.png')}
            style={[styles.icon, { tintColor: colors.white }]}
          />
          <ButtonText style={styles.backText}>{'Menüye Dön '}</ButtonText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>Ayarlar</ThemedText>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  if (inputRef.current) inputRef.current.focus();
                }}
                style={styles.row}
              >
                <ThemedText style={styles.rowLabel}>Kullanıcı İsmi</ThemedText>

                <View style={styles.rowSpacer} />

                <TextInput
                  ref={inputRef}
                  style={[
                    styles.input,
                    { backgroundColor: background, color: text },
                  ]}
                  onChangeText={setPlayerName}
                  onEndEditing={() => dispatch(addName(playerName))}
                  value={playerName}
                  placeholder='düzenle...'
                  placeholderTextColor={text}
                />

                <MaterialCommunityIcons
                  name='pencil-box-outline'
                  size={24}
                  color={text}
                />
              </TouchableOpacity>
            </View>

            {Platform.OS !== 'web' && (
              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <ThemedText style={styles.rowLabel}>Koyu Tema</ThemedText>

                  <View style={styles.rowSpacer} />

                  <Switch
                    onValueChange={toggleDark}
                    trackColor={{ false: colors.lightGray }}
                    value={dark}
                  />
                </View>
              </View>
            )}

            <Pressable
              style={styles.rowWrapper}
              onPress={() => router.navigate('./keyboardSetting')}
            >
              <View style={styles.row}>
                <ThemedText style={styles.rowLabel}>Klavye Düzeni</ThemedText>

                <View style={styles.rowSpacer} />

                <ThemedText style={styles.rowValue}>
                  {keyboardLayout === 'seperate' ? 'Ayrık' : 'Düz'}
                </ThemedText>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
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
    fontSize: 32,
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
