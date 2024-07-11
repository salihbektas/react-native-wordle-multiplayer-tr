import { colors } from "@/constants/Colors"
import { ActivityIndicator, Pressable, StyleSheet, Text, View, TextInput, Alert, Platform } from "react-native"
import { getDatabase, ref, get, update, runTransaction } from "firebase/database";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { makeHost, makePlayer } from "@/features/playerSlice/playerSlice";
import app from "@/utils/firebase";


type ServerType = {
  isWaiting: boolean;
  playerCount: number;
  serverName: string;
  playerList: string[];
}


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
  const [isLoading, setIsloading] = useState<boolean>(true)
  const [serverList, setServerList] = useState<ServerType[]>([])
  const dispatch = useDispatch()

  useEffect(() => {
    refreshServerList()
  }, [])

  function createServer() {
    if(playerName === ''){
      Platform.OS === 'web' ? alert('İsim girmediniz. Oda kurmak için isiminiz gerekli.')
      : Alert.alert('İsim girmediniz','Oda kurmak için isiminiz gerekli.',[{text: 'Tamam'}])
      return;
    }
    const updates: Record<string, unknown> = {};
    updates[`${playerName} oyun odası`] = {serverName: playerName, isWaiting: true, playerCount: 1, playerList: [playerName]};
    update(dbRef, updates);

    dispatch(makeHost())
    router.navigate('lobby')
  }

  function joinServer(serverName: string) {
    if(playerName === ''){
      Platform.OS === 'web' ? alert('İsim girmediniz. Oyuna katılmak için isiminiz gerekli.')
      : Alert.alert('İsim girmediniz','Oyuna katılmak için isiminiz gerekli.',[{text: 'Tamam'}])
      return;
    }

    runTransaction(ref(getDatabase(app), `/${serverName} oyun odası`), (serverState:ServerType) => {
      if(serverState){        
        serverState.playerCount++
        serverState.playerList.push(playerName)
      }
      return serverState;
    });

    dispatch(makePlayer())
    router.navigate('lobby')
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
              <Pressable style={styles.button} onPress={() => {joinServer(server.serverName)}}>
                <Text style={styles.buttonText}>Katıl</Text>
              </Pressable>
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
    justifyContent: 'space-between',
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