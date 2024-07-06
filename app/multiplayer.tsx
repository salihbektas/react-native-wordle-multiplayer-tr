import { colors } from "@/constants/Colors"
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native"

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { useState } from "react";


const firebaseConfig = {
  databaseURL: process.env.EXPO_PUBLIC_API_URL,
};

const app = initializeApp(firebaseConfig);

const dbRef = ref(getDatabase(app));

get(dbRef).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

export default function multiplayer() {
  const [amIHost, setAmIHost] = useState<boolean>(false)
  const [isLoading, setIsloading] = useState<boolean>(false)
  const [serverList, setServerList] = useState<Record<string, unknown>[]>([])

  return(
    <View style={styles.main}>
      <Text style={styles.text}>Multiplayer page</Text>

      <Text style={styles.text}>Server List</Text>

      <View style={styles.listContainer}>
      {isLoading 
        ? <ActivityIndicator size={'large'} style={styles.loading} color={colors.green} />
        : serverList.length === 0
          ? <Text style={styles.noServerText} >Sunucu Yok</Text>
          : null
      }

      </View>

      <Pressable style={styles.button} >
        <Text style={styles.buttonText}>Oyun Kur</Text>
      </Pressable>

      <Pressable style={styles.button} >
        <Text style={styles.buttonText}>Yenile</Text>
      </Pressable>
    </View>
  )
    
  
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
    fontSize: 30
  },

  listContainer:{
    flex:1,
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },

  loading: {
    margin: 'auto',
  },

  noServerText:{
    color: colors.white,
    fontSize: 30,
    margin: 'auto',
  },

  button: {
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },

  buttonText: {
    color: colors.black,
    fontSize: 24,
  }
})