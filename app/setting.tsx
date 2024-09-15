import ButtonText from '@/components/ButtonText';
import ThemedText from '@/components/ThemedText';
import { colors } from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
} from 'react-native';

export default function settings() {
  const colorScheme = useColorScheme();
  const [dark, setDark] = useState(colorScheme === 'dark');
  const { background } = colors[colorScheme ?? 'dark'];

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
                  // handle onPress
                }}
                style={styles.row}
              >
                <ButtonText style={styles.rowLabel}>Kullanıcı İsmi</ButtonText>

                <View style={styles.rowSpacer} />

                <ButtonText style={styles.rowValue}>İsim Yok</ButtonText>

                <Image
                  source={require('../assets/images/back.png')}
                  style={[
                    styles.icon,
                    { transform: [{ rotateY: '180deg' }] },
                    { tintColor: colors.white },
                  ]}
                />
              </TouchableOpacity>
            </View>

            {Platform.OS !== 'web' && (
              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <ButtonText style={styles.rowLabel}>Koyu Tema</ButtonText>

                  <View style={styles.rowSpacer} />

                  <Switch
                    onValueChange={(darkMode) => {
                      setDark(darkMode);
                      if (Platform.OS !== 'web')
                        Appearance.setColorScheme(darkMode ? 'dark' : 'light');
                    }}
                    trackColor={{ false: colors.lightGray }}
                    value={dark}
                  />
                </View>
              </View>
            )}

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}
              >
                <ButtonText style={styles.rowLabel}>Font Boyutu</ButtonText>

                <View style={styles.rowSpacer} />

                <ButtonText style={styles.rowValue}>32</ButtonText>

                <Image
                  source={require('../assets/images/back.png')}
                  style={[
                    styles.icon,
                    { transform: [{ rotateY: '180deg' }] },
                    { tintColor: colors.white },
                  ]}
                />
              </TouchableOpacity>
            </View>
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
});
