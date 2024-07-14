import { colors } from "@/constants/Colors"
import { RootState } from "@/store/store"
import dbRootRef, { ServerType } from "@/utils/firebase"
import { router } from "expo-router"
import { child, off, onValue, remove, runTransaction } from "firebase/database"
import { useEffect, useRef, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useSelector } from "react-redux"


export default function lobby() {
  const {amIHost, playerName, dbRefName} = useSelector((state: RootState) => state.player)

  const [playerList, setPlayerList] = useState<string[]>([])

  useEffect(() => {

    const unsubscribe = onValue(child(dbRootRef, dbRefName), snapshot => {
      if(snapshot.exists()){
        setPlayerList(snapshot.val().playerList)
      }
      else{
        router.back()
      }
    })

    return unsubscribe
  }, [])


  function disconnect() {
    const dbRef = child(dbRootRef, dbRefName)
    if(amIHost){
      remove(dbRef)
    }
    else{
      runTransaction(dbRef, (serverState:ServerType) => {
        if(serverState){        
          serverState.playerCount--
          serverState.playerList = serverState.playerList.filter(playerNameOnList => playerName !== playerNameOnList)
        }
        return serverState;
      }).then(() => {
        off(dbRef)
        router.back()
      });
    }
  }

  return(
    <View style={styles.main}>
      <Text style={styles.text}>Oyun Lobisi</Text>

      <Text style={styles.text}>Oyuncu Listesi</Text>

      <View style={styles.listContainer}>
      
      <Text style={styles.text} >Oyuncular...</Text>
      {playerList.map((playerName, index) => 
        <View key={index} style={styles.listRow} >
          <Text style={styles.text} >{playerName}</Text>
        </View>
      )}

      </View>

      {amIHost && <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Başlat</Text>
        </Pressable>
      }

      <Pressable style={styles.button} onPress={disconnect}>
        <Text style={styles.buttonText}>{amIHost ? 'Odayı Dağıt' : 'Odadan Ayrıl'}</Text>
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

  listRow: {
    padding: 4,
    marginVertical: 2,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.lightGray,
    flexDirection: 'row',
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