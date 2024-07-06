import { colors } from "@/constants/Colors"
import { ActivityIndicator, Pressable, StyleSheet, Text, View, TextInput } from "react-native"
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update } from "firebase/database";
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
  const [playerName, setPlayerName] = useState<string>('')
  const [amIHost, setAmIHost] = useState<boolean>(false)
  const [isLoading, setIsloading] = useState<boolean>(false)
  const [serverList, setServerList] = useState<Record<string, unknown>[]>([])

  function createServer() {
    const updates: Record<string, unknown> = {};
    updates[`${playerName} oyun odası`] = {serverName: playerName, isWaiting: true, playerCount: 1};
    return update(dbRef, updates);
  }

  function refreshServerList() {
    setIsloading(true)
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        setServerList(Object.keys(snapshot.val()).filter(item => snapshot.val()[item].isWaiting).map(item => snapshot.val()[item]))
      } else {
        console.log("No data available");
      }
      setIsloading(false)
    }).catch((error) => {
      console.error(error);
      setIsloading(false)
    });
  }

  return(
    <View style={styles.main}>
      <Text style={styles.text}>Multiplayer page</Text>

      <TextInput
        style={styles.input}
        onChangeText={setPlayerName}
        value={playerName}
        placeholder="oyuncu ismi"
      />

      <Text style={styles.text}>Server List</Text>

      <View style={styles.listContainer}>
      {isLoading 
        ? <ActivityIndicator size={'large'} style={styles.loading} color={colors.green} />
        : serverList.length === 0
          ? <Text style={styles.noServerText} >Sunucu Yok</Text>
          : serverList.map((server, index) => 
            <View key={index} style={styles.listRow} >
              <Text style={styles.text} >{`${server.serverName}   ${server.playerCount}`}</Text>
            </View>
          )
      }

      </View>

      <Pressable style={styles.button} onPress={createServer}>
        <Text style={styles.buttonText}>Oyun Kur</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={refreshServerList}>
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

  input:{
    backgroundColor: colors.darkGray,
    padding: 8,
    borderRadius: 8,
    color: colors.black,
    fontSize: 30,
    marginVertical: 4,

  },

  listContainer:{
    flex:1,
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },

  listRow: {
    padding: 4,
    marginVertical: 2,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.lightGray,
    flexDirection: 'row',
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