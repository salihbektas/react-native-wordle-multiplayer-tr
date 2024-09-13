import { colors } from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Pressable,
} from 'react-native';

export default function settings() {
  const [form, setForm] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.button}
            onPress={() => router.navigate('./')}
          >
            <Image
              source={require('../assets/images/back.png')}
              style={styles.icon}
            />
            <Text style={styles.backText}>{'Menüye Dön '}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Ayarlar</Text>
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
                  <Text style={styles.rowLabel}>Kullanıcı İsmi</Text>

                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}>İsim Yok</Text>

                  <Image
                    source={require('../assets/images/back.png')}
                    style={[
                      styles.icon,
                      { transform: [{ rotateY: '180deg' }] },
                    ]}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Koyu Tema</Text>

                  <View style={styles.rowSpacer} />

                  <Switch
                    onValueChange={(darkMode) => setForm({ ...form, darkMode })}
                    value={form.darkMode}
                  />
                </View>
              </View>

              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}
                >
                  <Text style={styles.rowLabel}>Font Boyutu</Text>

                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}>32</Text>

                  <Image
                    source={require('../assets/images/back.png')}
                    style={[
                      styles.icon,
                      { transform: [{ rotateY: '180deg' }] },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
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
    tintColor: colors.black,
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
    color: colors.white,
  },
  button: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingBottom: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'center',
  },
  backText: {
    color: colors.black,
    fontWeight: '600',
    fontSize: 20,
  },
  /** Section */
  section: {
    paddingTop: 12,
  },
  sectionBody: {
    paddingLeft: 24,
    backgroundColor: colors.white,
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
    color: colors.black,
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.darkGray,
    marginRight: 4,
  },
});
